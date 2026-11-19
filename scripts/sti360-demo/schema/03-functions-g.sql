-- Functions read from the live catalog (pg_get_functiondef), part G.
CREATE OR REPLACE FUNCTION public.superuser_confirm_active()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_email text;
begin
  select lower(u.email) into v_email
  from public.users u
  join public.authorized_accounts a on a.email = lower(u.email)
  where u.id = auth.uid() and u.role = 'superuser' and a.role = 'superuser' and a.is_active;
  if v_email is null then
    raise exception 'Only the active Superuser can confirm.';
  end if;

  update public.system_alerts
  set status = 'cancelled', resolved_at = now(), resolved_by = auth.uid()
  where kind = 'superuser_report' and status = 'open';

  update public.authorized_accounts set updated_at = now() where email = v_email;

  insert into public.audit_logs (action, actor_id, actor_email, table_name, details)
  values ('superuser_confirmed_active', auth.uid(), v_email, 'system_alerts',
          'Superuser confirmed they are still active; any pending report was cancelled.');
end;
$function$
;

CREATE OR REPLACE FUNCTION public.superuser_failsafe_check()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  s        record;
  v_report public.system_alerts;
begin
  if auth.uid() is not null and coalesce(public.get_my_role(), '') not in ('admin', 'superuser') then
    raise exception 'Only the Admin or Superuser can run this check.';
  end if;

  select aa.email,
         (select max(u.last_sign_in_at) from auth.users u where lower(u.email) = aa.email) as last_sign_in
  into s
  from public.authorized_accounts aa
  where aa.role = 'superuser' and aa.is_active;

  if not found then
    return jsonb_build_object('status', 'no_active_superuser');
  end if;

  select * into v_report from public.system_alerts where kind = 'superuser_report' and status = 'open';
  if found then
    if s.last_sign_in > v_report.created_at then
      update public.system_alerts set status = 'cancelled', resolved_at = now() where id = v_report.id;
      insert into public.audit_logs (action, actor_id, target_email, table_name, details)
      values ('superuser_report_cancelled', null, s.email, 'system_alerts',
              'Superuser signed in after being reported unavailable; report cancelled.');
    elsif now() >= v_report.expires_at then
      perform public._superuser_needs_replacement(
        s.email,
        'was reported unavailable by the Admin and did not sign in within 24 hours',
        'manual');
      return jsonb_build_object('status', 'replacement_needed');
    else
      return jsonb_build_object('status', 'report_pending', 'expires_at', v_report.expires_at);
    end if;
  end if;

  return jsonb_build_object('status', 'ok');
end;
$function$
;

CREATE OR REPLACE FUNCTION public.sync_my_authorized_user()
 RETURNS TABLE(id uuid, email text, first_name text, last_name text, role text, is_active boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_email text := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  v_account public.authorized_accounts%rowtype;
  v_user_id uuid := auth.uid();
  v_name text;
begin
  if v_user_id is null or v_email = '' then
    raise exception 'Authenticated Microsoft account email is required';
  end if;

  select * into v_account from public.authorized_accounts a where a.email = v_email;

  if not found and public.is_sti_student_email(v_email) then
    select coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', v_email)
      into v_name from auth.users u where u.id = v_user_id;
    insert into public.authorized_accounts as a (email, first_name, last_name, role, is_active)
    values (v_email, v_name, null, 'student', true)
    returning a.* into v_account;
  end if;

  if v_account.email is null or v_account.is_active is not true then
    raise exception 'This Microsoft account is not authorized';
  end if;

  insert into public.users as pu (id, email, first_name, last_name, role, is_active, updated_at)
  values (v_user_id, v_account.email, v_account.first_name, coalesce(v_account.last_name, ''),
          v_account.role, v_account.is_active, now())
  on conflict on constraint users_pkey do update set
    email = excluded.email, first_name = excluded.first_name, last_name = excluded.last_name,
    role = excluded.role, is_active = excluded.is_active, updated_at = now();

  return query
  select pu.id, pu.email, pu.first_name, pu.last_name, pu.role, pu.is_active
  from public.users pu where pu.id = v_user_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.sync_user_from_authorized_account(p_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_auth  record;
  v_acc   public.authorized_accounts%rowtype;
  v_first text;
  v_last  text;
begin
  select * into v_acc from public.authorized_accounts a where a.email = lower(trim(p_email));
  if not found then
    return;
  end if;
  v_first := nullif(trim(v_acc.first_name), '');
  v_last  := nullif(trim(v_acc.last_name), '');

  for v_auth in select u.id from auth.users u where lower(u.email) = v_acc.email loop
    begin
      insert into public.users (id, email, first_name, last_name, role, is_active)
      values (v_auth.id, v_acc.email, coalesce(v_first, v_acc.email), coalesce(v_last, ''),
              v_acc.role, coalesce(v_acc.is_active, true))
      on conflict (id) do update
        set role       = excluded.role,
            is_active  = excluded.is_active,
            first_name = case when v_first is not null then v_first else users.first_name end,
            last_name  = case when v_first is not null then coalesce(v_last, '') else users.last_name end,
            updated_at = now()
        where users.role      is distinct from excluded.role
           or users.is_active is distinct from excluded.is_active
           or (v_first is not null and (users.first_name is distinct from v_first
                                        or users.last_name is distinct from coalesce(v_last, '')));
    exception when others then
      raise warning 'sync_user_from_authorized_account(%): %', v_acc.email, sqlerrm;
    end;
  end loop;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.temp_account_counts()
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_object_agg(status, n), '{}'::jsonb)
  from (select status, count(*) n from temp_accounts_v group by status) t;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_authorized_accounts_deactivation_reason()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  if coalesce(new.is_active, true) then
    new.deactivation_reason := null;
  elsif tg_op = 'INSERT' or old.is_active is distinct from false then
    new.deactivation_reason := coalesce(new.deactivation_reason, 'manual');
  end if;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_authorized_accounts_not_archived()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if exists (select 1 from public.archived_records
             where source_table = 'authorized_accounts' and lower(archived_data->>'email') = lower(new.email))
     or exists (select 1 from public.archive_vault
             where source_table = 'authorized_accounts' and lower(summary->>'email') = lower(new.email)) then
    raise exception 'This email belongs to an archived account. Restore it from the Archive tab instead.'
      using errcode = 'P0001';
  end if;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_enrollment_link_exam_accounts()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare a record; m record;
begin
  for a in
    select t.id, t.source, t.source_id, t.email, t.phone, t.first_name, t.last_name, t.student_name
    from public.temp_exam_accounts t
    where t.enrollment_id is null
      and t.source in ('lead', 'manual')
      and (
        (t.source = 'lead' and t.source_id = new.lead_id)
        or (public.exam_email_key(t.email) <> '' and public.exam_email_key(t.email) = public.exam_email_key(new.email))
        or (public.exam_phone_key(t.phone) <> '' and public.exam_phone_key(t.phone) = public.exam_phone_key(new.phone))
        or public.exam_name_key(new.first_name, new.last_name) in (
             public.exam_name_key(t.first_name, t.last_name),
             (select case when cardinality(w) >= 2 then w[1] || '|' || w[cardinality(w)] end
              from (select public.exam_name_words(t.student_name) as w) x))
      )
  loop
    select * into m from public.exam_account_find_enrollment(
      a.source, a.source_id, a.email, a.phone, a.first_name, a.last_name, a.student_name);
    if m.enrollment_id is not null then
      update public.temp_exam_accounts
      set enrollment_id = m.enrollment_id, linked_by = m.linked_by
      where id = a.id and enrollment_id is null;
    end if;
  end loop;
  return null;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_exam_account_link()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare m record;
begin
  if new.enrollment_id is null then
    select * into m from public.exam_account_find_enrollment(
      new.source, new.source_id, new.email, new.phone, new.first_name, new.last_name, new.student_name);
    if m.enrollment_id is not null then
      new.enrollment_id := m.enrollment_id;
      new.linked_by := m.linked_by;
    end if;
  end if;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;
