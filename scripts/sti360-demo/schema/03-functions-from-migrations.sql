-- Functions identical on the live project and in the repo migrations (md5-checked).
CREATE OR REPLACE FUNCTION public._active_caller_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select u.role
  from public.users u
  join public.authorized_accounts a on a.email = lower(u.email)
  where u.id = auth.uid() and u.is_active and a.is_active and a.role = u.role
  limit 1;
$function$
;

CREATE OR REPLACE FUNCTION public._archive_before_condition(p_table text, p_column text, p_before date)
 RETURNS text
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_type text;
begin
  if not (p_column = any (public._archive_date_columns(p_table))) then
    raise exception '"%" is not a date field of %.', p_column, public._archive_noun(p_table);
  end if;
  if p_before is null then
    raise exception 'Choose a cut-off date.';
  end if;
  if p_before > (now() at time zone 'Asia/Manila')::date + 1 then
    raise exception 'The cut-off date can''t be in the future.';
  end if;
  select c.data_type into v_type from information_schema.columns c
  where c.table_schema = 'public' and c.table_name = p_table and c.column_name = p_column;
  return case v_type
    when 'timestamp with time zone' then format('%I < (%L::timestamp at time zone ''Asia/Manila'')', p_column, p_before)
    else format('%I < %L', p_column, p_before)
  end;
end;
$function$
;

CREATE OR REPLACE FUNCTION public._archive_date_columns(p_table text)
 RETURNS text[]
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(array_agg(c.column_name::text order by
           case c.column_name when 'created_at' then 0 else 1 end, c.ordinal_position), '{}')
  from information_schema.columns c
  where c.table_schema = 'public' and c.table_name = p_table
    and c.data_type in ('timestamp with time zone', 'timestamp without time zone', 'date')
    and c.column_name not in ('birthdate', 'expires_at', 'locked_until', 'session_expires_at', 'archived_at');
$function$
;

CREATE OR REPLACE FUNCTION public._require_active_admin()
 RETURNS text
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_email text;
begin
  select lower(u.email) into v_email
  from public.users u
  join public.authorized_accounts a on a.email = lower(u.email)
  where u.id = auth.uid() and u.role = 'admin' and a.role = 'admin' and a.is_active;
  if v_email is null then
    raise exception 'Only the Admin can do this.';
  end if;
  return v_email;
end;
$function$
;

CREATE OR REPLACE FUNCTION public._superuser_needs_replacement(p_email text, p_details text, p_reason text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_email text := lower(trim(p_email));
begin
  update public.authorized_accounts
  set is_active = false,
      deactivation_reason = p_reason,
      updated_at = now()
  where email = v_email and role = 'superuser' and is_active;

  insert into public.system_alerts (kind, subject_email, details)
  values ('superuser_disabled', v_email, p_details)
  on conflict (kind) where status = 'open' do nothing;

  update public.system_alerts
  set status = 'resolved', resolved_at = now()
  where kind = 'superuser_report' and status = 'open';

  insert into public.audit_logs (action, actor_id, target_email, table_name, details)
  values ('superuser_replacement_needed', null, v_email, 'authorized_accounts',
          'Superuser ' || p_details || '. Superuser deactivated; Admin asked to assign a new Superuser.');
end;
$function$
;

CREATE OR REPLACE FUNCTION public.admin_assign_superuser(p_email text, p_first_name text, p_last_name text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_uid       uuid := auth.uid();
  v_caller    text;
  v_email     text := lower(trim(coalesce(p_email, '')));
  v_first     text := nullif(trim(coalesce(p_first_name, '')), '');
  v_last      text := nullif(trim(coalesce(p_last_name, '')), '');
  v_alert     uuid;
  v_existing  text;
begin
  select lower(u.email) into v_caller
  from public.users u
  join public.authorized_accounts a on a.email = lower(u.email)
  where u.id = v_uid and u.role = 'admin' and a.role = 'admin' and a.is_active;
  if v_caller is null then
    raise exception 'Only the Admin can assign a new Superuser.';
  end if;

  select id into v_alert from public.system_alerts
  where kind = 'superuser_disabled' and status = 'open';
  if v_alert is null then
    raise exception 'A new Superuser can only be assigned after the current Superuser''s Microsoft account has been disabled.';
  end if;

  if exists (select 1 from public.authorized_accounts where role = 'superuser' and is_active) then
    raise exception 'There is already an active Superuser.';
  end if;

  if v_email !~ '^[^@\s]+@([a-z0-9-]+\.)*sti\.edu\.ph$' then
    raise exception 'The new Superuser must use an STI Microsoft work account (…@alabang.sti.edu.ph).';
  end if;
  if v_email = v_caller then
    raise exception 'The Admin cannot assign themselves as Superuser.';
  end if;
  if v_first is null then
    raise exception 'First name is required.';
  end if;

  select role into v_existing from public.authorized_accounts where email = v_email;
  if v_existing = 'admin' then
    raise exception 'That account is the Admin and cannot become the Superuser.';
  end if;

  insert into public.authorized_accounts (email, first_name, last_name, role, is_active, created_by)
  values (v_email, v_first, v_last, 'superuser', true, v_uid)
  on conflict (email) do update
    set role = 'superuser',
        is_active = true,
        first_name = coalesce(excluded.first_name, public.authorized_accounts.first_name),
        last_name  = coalesce(excluded.last_name,  public.authorized_accounts.last_name),
        ms_verified_at = null,
        ms_checked_at  = null,
        updated_at = now();

  update public.system_alerts
  set status = 'resolved', resolved_at = now(), resolved_by = v_uid
  where id = v_alert;

  insert into public.audit_logs (action, actor_id, actor_email, target_email, table_name, details)
  values ('assign_superuser', v_uid, v_caller, v_email, 'authorized_accounts',
          'Admin assigned a new Superuser after the previous Superuser''s Microsoft account was disabled.');
end;
$function$
;

CREATE OR REPLACE FUNCTION public.admin_auth_user_ids_by_email(p_email text)
 RETURNS SETOF uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select u.id from auth.users u where lower(u.email) = lower(trim(p_email));
$function$
;

CREATE OR REPLACE FUNCTION public.admin_report_superuser_unavailable()
 RETURNS timestamp with time zone
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_admin   text := public._require_active_admin();
  v_su      text;
  v_expires timestamptz := now() + interval '24 hours';
begin
  select email into v_su from public.authorized_accounts where role = 'superuser' and is_active;
  if v_su is null then
    raise exception 'There is no active Superuser to report.';
  end if;
  if exists (select 1 from public.system_alerts where kind in ('superuser_report', 'superuser_disabled') and status = 'open') then
    raise exception 'A report or replacement is already in progress.';
  end if;

  insert into public.system_alerts (kind, subject_email, details, expires_at, created_by)
  values ('superuser_report', v_su, 'Reported unavailable by the Admin', v_expires, auth.uid());

  insert into public.audit_logs (action, actor_id, actor_email, target_email, table_name, details)
  values ('superuser_reported_unavailable', auth.uid(), v_admin, v_su, 'system_alerts',
          'Admin reported the Superuser unavailable. If they do not sign in by ' ||
          to_char(v_expires at time zone 'Asia/Manila', 'Mon DD, YYYY HH12:MI AM') ||
          ' (PH time), the Admin can assign a new Superuser.');
  return v_expires;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.admin_withdraw_superuser_report()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_admin text := public._require_active_admin();
  v_id    uuid;
begin
  update public.system_alerts
  set status = 'cancelled', resolved_at = now(), resolved_by = auth.uid()
  where kind = 'superuser_report' and status = 'open'
  returning id into v_id;
  if v_id is null then
    raise exception 'There is no pending report to withdraw.';
  end if;

  insert into public.audit_logs (action, actor_id, actor_email, table_name, details)
  values ('superuser_report_withdrawn', auth.uid(), v_admin, 'system_alerts',
          'Admin withdrew the Superuser unavailable report.');
end;
$function$
;

CREATE OR REPLACE FUNCTION public.archive_preview_by_date(p_source_table text, p_date_column text, p_before date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_role text := public._active_caller_role();
  v_cond text;
  v_res  jsonb;
begin
  if v_role is null or not public._archive_allowed(v_role, p_source_table) then
    raise exception 'Not allowed.' using errcode = '42501';
  end if;
  v_cond := public._archive_before_condition(p_source_table, p_date_column, p_before);
  execute format('select jsonb_build_object(''count'', count(*), ''oldest'', min(%1$I), ''newest'', max(%1$I)) from public.%2$I where %3$s',
                 p_date_column, p_source_table, v_cond)
    into v_res;
  return v_res;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.bulk_archive_by_date(p_source_table text, p_date_column text, p_before date, p_reason text DEFAULT NULL::text, p_limit integer DEFAULT 200, p_skip uuid[] DEFAULT '{}'::uuid[])
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_role  text := public._active_caller_role();
  v_cond  text;
  v_ids   uuid[];
  v_res   jsonb;
  v_left  bigint;
begin
  if v_role is null or not public._archive_allowed(v_role, p_source_table) then
    raise exception 'Not allowed: % cannot archive %.', coalesce(v_role, 'this account'), public._archive_noun(p_source_table)
      using errcode = '42501';
  end if;
  v_cond := public._archive_before_condition(p_source_table, p_date_column, p_before);

  execute format('select coalesce(array_agg(id), ''{}'') from (select id from public.%I where %s and not (id = any ($1)) order by %I limit $2) s',
                 p_source_table, v_cond, p_date_column)
    into v_ids using coalesce(p_skip, '{}'), least(greatest(coalesce(p_limit, 200), 1), 500);

  v_res := public.bulk_archive_records(p_source_table, v_ids, p_reason);

  execute format('select count(*) from public.%I where %s and not (id = any ($1))', p_source_table, v_cond)
    into v_left using coalesce(p_skip, '{}') || array(select (f->>'id')::uuid from jsonb_array_elements(v_res->'failed') f);

  return v_res || jsonb_build_object('remaining', v_left);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.bulk_archive_records(p_source_table text, p_source_ids uuid[], p_reason text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_role     text := public._active_caller_role();
  v_id       uuid;
  v_archived int := 0;
  v_failed   jsonb := '[]'::jsonb;
begin
  if v_role is null or not public._archive_allowed(v_role, p_source_table) then
    raise exception 'Not allowed: % cannot archive %.', coalesce(v_role, 'this account'), public._archive_noun(p_source_table)
      using errcode = '42501';
  end if;
  if coalesce(array_length(p_source_ids, 1), 0) > 500 then
    raise exception 'Archive at most 500 records at a time.';
  end if;

  foreach v_id in array coalesce(p_source_ids, '{}') loop
    begin
      perform public.archive_record(p_source_table, v_id, p_reason);
      v_archived := v_archived + 1;
    exception when others then
      v_failed := v_failed || jsonb_build_array(jsonb_build_object('id', v_id, 'error', sqlerrm));
    end;
  end loop;

  return jsonb_build_object('archived', v_archived, 'failed', v_failed);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.check_archived_duplicate(p_source_table text, p_email text DEFAULT NULL::text, p_source_id uuid DEFAULT NULL::uuid)
 RETURNS TABLE(id uuid, source_id uuid, archived_at timestamp with time zone, reason text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if coalesce(public._active_caller_role(), '') not in ('admin', 'superuser', 'frontdesk', 'marketing', 'guidance') then
    raise exception 'Not allowed.' using errcode = '42501';
  end if;

  return query
  select
    ar.id,
    ar.source_id,
    ar.archived_at,
    ar.archive_reason as reason
  from public.archived_records ar
  where ar.source_table = p_source_table
    and (
      (p_source_id is not null and ar.source_id = p_source_id)
      or
      (p_email is not null and ar.archived_data->>'email' ilike p_email)
    )
  order by ar.archived_at desc
  limit 1;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.enrollment_school_origin(p_enrollment_id uuid)
 RETURNS TABLE(school_origin text, school_origin_type text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(s.name, e.school_name),
         case when s.id is null then 'unknown'
              when s.type = 'feeder' then 'feeder'
              else 'non-feeder' end
  from public.enrollments e
  left join public.schools s on s.id = e.school_id
  where e.id = p_enrollment_id
    and coalesce(s.name, e.school_name) is not null;
$function$
;

CREATE OR REPLACE FUNCTION public.enrollments_fill_school()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  new.school_name := nullif(btrim(new.school_name), '');

  if new.school_name is not null and new.school_id is null then
    select s.id into new.school_id
    from public.schools s
    where lower(btrim(s.name)) = lower(new.school_name)
    order by s.created_at
    limit 1;
  elsif new.school_name is null and new.school_id is not null then
    select s.name into new.school_name from public.schools s where s.id = new.school_id;
  end if;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.enrollments_lock_year_level()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  if new.year_level is distinct from old.year_level
     and (select auth.uid()) is not null
     and coalesce(public.get_my_role(), '') not in ('admin', 'superuser') then
    raise exception 'Year level comes from the batch upload and can''t be changed here.'
      using errcode = '42501';
  end if;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.fill_enrollment_school_names(p_rows jsonb)
 RETURNS integer
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  with src as (
    select distinct on (x.student_id, x.school_year, x.semester)
           btrim(x.student_id) as student_id, x.school_year, x.semester,
           nullif(btrim(x.school_name), '') as school_name
    from jsonb_to_recordset(coalesce(p_rows, '[]'::jsonb))
           as x(student_id text, school_year text, semester text, school_name text)
  ), upd as (
    update public.enrollments e
       set school_name = src.school_name
      from src
     where e.student_id = src.student_id
       and e.school_year = src.school_year
       and e.semester = src.semester
       and e.school_name is null
       and src.school_name is not null
       and char_length(src.school_name) <= 200
    returning 1
  )
  select count(*)::int from upd;
$function$
;

CREATE OR REPLACE FUNCTION public.get_superuser_status()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  s        record;
  v_report public.system_alerts;
  v_alert  public.system_alerts;
begin
  if coalesce(public.get_my_role(), '') not in ('admin', 'superuser') then
    raise exception 'Only the Admin or Superuser can view this.';
  end if;

  select aa.email, aa.first_name, aa.last_name,
         (select max(u.last_sign_in_at) from auth.users u where lower(u.email) = aa.email) as last_sign_in
  into s
  from public.authorized_accounts aa
  where aa.role = 'superuser' and aa.is_active;

  select * into v_report from public.system_alerts where kind = 'superuser_report' and status = 'open';
  select * into v_alert  from public.system_alerts where kind = 'superuser_disabled' and status = 'open';

  return jsonb_build_object(
    'report_hours', 24,
    'superuser', case when s.email is null then null else jsonb_build_object(
      'email', s.email,
      'name', nullif(trim(concat_ws(' ', s.first_name, s.last_name)), ''),
      'last_sign_in_at', s.last_sign_in) end,
    'report', case when v_report.id is null then null else jsonb_build_object(
      'created_at', v_report.created_at,
      'expires_at', v_report.expires_at) end,
    'replacement_needed', v_alert.id is not null
  );
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_full text;
begin
  if exists (select 1 from public.authorized_accounts a where a.email = lower(new.email)) then
    perform public.sync_user_from_authorized_account(new.email);
    return new;
  end if;

  if not public.is_sti_student_email(new.email) then
    return new;
  end if;
  v_full := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email);
  insert into public.users (id, email, first_name, last_name, role, is_active)
  values (new.id, lower(new.email), v_full, '', 'student', true)
  on conflict (id) do nothing;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.report_superuser_microsoft_disabled(p_email text, p_details text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  perform public._superuser_needs_replacement(p_email, p_details, 'microsoft_disabled');
end;
$function$
;

CREATE OR REPLACE FUNCTION public.school_registry_area_city(p_source text, p_place text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
  select case
    when p_source = 'deped' then case p_place
      when 'NCR Paranaque City' then 'Parañaque'
      when 'Parañaque City'     then 'Parañaque'
      when 'Muntinlupa City'    then 'Muntinlupa'
      when 'Laguna San Pedro'   then 'San Pedro'
      when 'San Pedro City'     then 'San Pedro'
    end
    when p_source = 'ched' then case
      when p_place ilike '%muntinlupa%'  then 'Muntinlupa'
      when p_place ilike '%para_aque%'   then 'Parañaque'
      when p_place ilike '%san pedro%'   then 'San Pedro'
    end
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.superuser_reactivate_student(p_account_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_actor text;
  v_acc   public.authorized_accounts%rowtype;
begin
  select lower(u.email) into v_actor
  from public.users u
  join public.authorized_accounts a on a.email = lower(u.email)
  where u.id = auth.uid() and u.role = 'superuser' and a.role = 'superuser' and a.is_active;
  if v_actor is null then
    raise exception 'Only the Superuser can reactivate student accounts.';
  end if;

  select * into v_acc from public.authorized_accounts where id = p_account_id for update;
  if not found then
    raise exception 'Account not found.';
  end if;
  if v_acc.role <> 'student' then
    raise exception 'Only student accounts can be reactivated here.';
  end if;
  if v_acc.is_active then
    return;
  end if;

  update public.authorized_accounts
  set is_active = true, updated_at = now()   -- trigger clears deactivation_reason
  where id = p_account_id;

  insert into public.audit_logs (action, actor_id, actor_email, target_email, table_name, record_id, details)
  values ('student_reactivated', auth.uid(), v_actor, v_acc.email, 'authorized_accounts', v_acc.id,
          'Superuser reactivated student account (was deactivated: ' ||
          coalesce(v_acc.deactivation_reason, 'unknown') || ').');
end;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_archive_snapshots_keep()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  if current_user in ('service_role', 'postgres', 'supabase_admin') then
    return old;
  end if;
  raise exception 'Monthly archive backups are kept permanently and can''t be deleted.'
    using errcode = 'P0001';
end;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_at_risk_cases_stamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  new.updated_by_email := (select lower(email) from auth.users where id = auth.uid());
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_scholarship_not_in_use()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare n int;
begin
  select count(*) into n
  from public.scholar_batch
  where scholarship_type = old.name or scholarship_name = old.name;
  if n > 0 then
    raise exception '"%" is still assigned to % scholar%. Change or archive those scholars in Scholar Upload first.',
      old.name, n, case when n = 1 then '' else 's' end
      using errcode = 'P0001';
  end if;
  return old;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_sync_user_from_authorized_account()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  perform public.sync_user_from_authorized_account(new.email);
  return new;
end;
$function$
;
