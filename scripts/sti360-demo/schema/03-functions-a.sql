-- Functions read from the live catalog (pg_get_functiondef), part A.
CREATE OR REPLACE FUNCTION public._archive_allowed(p_role text, p_table text)
 RETURNS boolean
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case
    when p_role = 'superuser' then p_table = any (array[
      'leads', 'enrollments', 'scholarships', 'scholar_batch', 'student_profiles',
      'schools', 'reports', 'fari_submissions', 'employment_surveys',
      'graduating_students', 'users', 'curriculum_subjects', 'form138_grades',
      'counseling_records'])
    when p_role = 'admin' then p_table = any (array[
      'leads', 'enrollments', 'scholarships', 'scholar_batch', 'student_profiles',
      'schools', 'reports', 'fari_submissions', 'employment_surveys',
      'graduating_students', 'curriculum_subjects', 'form138_grades',
      'counseling_records'])
    when p_role = 'marketing' then p_table = any (array['leads', 'schools'])
    when p_role = 'guidance'  then p_table = any (array['employment_surveys', 'counseling_records'])
    else false
  end;
$function$
;

CREATE OR REPLACE FUNCTION public._archive_collect_related(p_table text, p_id uuid, p_depth integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  fk        record;
  v_n       int;
  v_rows    jsonb;
  v_ids     jsonb;
  v_child   record;
  v_nested  jsonb;
  v_cascade jsonb := '[]'::jsonb;
  v_relink  jsonb := '[]'::jsonb;
  v_primary text[] := array[
    'leads', 'enrollments', 'scholarships', 'scholar_batch', 'student_profiles', 'schools',
    'reports', 'sections', 'fari_submissions', 'employment_surveys', 'graduating_students',
    'users', 'curriculum_subjects', 'form138_grades', 'authorized_accounts', 'counseling_records'];
begin
  if p_depth > 3 then
    raise exception 'Archive: related records under % nest too deeply.', public._archive_noun(p_table);
  end if;

  for fk in
    select cl.relname::text as child, a.attname::text as col, c.confdeltype as del,
           exists (select 1 from pg_attribute x where x.attrelid = c.conrelid and x.attname = 'id' and not x.attisdropped) as has_id
    from pg_constraint c
    join pg_class cl      on cl.oid = c.conrelid
    join pg_namespace n   on n.oid = cl.relnamespace
    join pg_attribute a   on a.attrelid = c.conrelid and a.attnum = c.conkey[1]
    join pg_attribute pa  on pa.attrelid = c.confrelid and pa.attnum = c.confkey[1]
    where c.contype = 'f'
      and c.confrelid = ('public.' || p_table)::regclass
      and array_length(c.conkey, 1) = 1
      and pa.attname = 'id'
      and n.nspname = 'public'
  loop
    execute format('select count(*) from public.%I where %I = $1', fk.child, fk.col) into v_n using p_id;
    continue when v_n = 0;

    if fk.del = 'c' then
      if fk.child = any (v_primary) then
        raise exception 'This % can''t be archived: % % record(s) belong to it and would be removed too. Archive those first.',
          public._archive_noun(p_table), v_n, public._archive_noun(fk.child)
          using errcode = 'P0001';
      end if;
      execute format('select jsonb_agg(to_jsonb(t)) from public.%I t where %I = $1', fk.child, fk.col)
        into v_rows using p_id;
      v_nested := '[]'::jsonb;
      if fk.has_id then
        for v_child in execute format('select id from public.%I where %I = $1', fk.child, fk.col) using p_id loop
          v_nested := v_nested || jsonb_build_array(jsonb_build_object(
            'id', v_child.id,
            'related', public._archive_collect_related(fk.child, v_child.id, p_depth + 1)));
        end loop;
      end if;
      v_cascade := v_cascade || jsonb_build_array(jsonb_build_object('table', fk.child, 'rows', v_rows, 'nested', v_nested));

    elsif fk.del = 'n' then
      if fk.has_id then
        execute format('select jsonb_agg(id) from public.%I where %I = $1', fk.child, fk.col) into v_ids using p_id;
        v_relink := v_relink || jsonb_build_array(jsonb_build_object('table', fk.child, 'column', fk.col, 'ids', v_ids));
      end if;

    else
      raise exception 'This % can''t be archived: % % record(s) still use it.',
        public._archive_noun(p_table), v_n, public._archive_noun(fk.child)
        using errcode = 'P0001';
    end if;
  end loop;

  return jsonb_build_object('cascade', v_cascade, 'relink', v_relink);
end;
$function$
;

CREATE OR REPLACE FUNCTION public._archive_insert(p_table text, p_row jsonb, p_skip_existing boolean DEFAULT false)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_cols text;
begin
  select string_agg(quote_ident(a.attname), ', ' order by a.attnum) into v_cols
  from pg_attribute a
  where a.attrelid = ('public.' || p_table)::regclass
    and a.attnum > 0 and not a.attisdropped and a.attgenerated = '';
  execute format(
    'insert into public.%I (%s) select %s from jsonb_populate_record(null::public.%I, $1)%s',
    p_table, v_cols, v_cols, p_table, case when p_skip_existing then ' on conflict do nothing' else '' end
  ) using p_row;
end;
$function$
;

CREATE OR REPLACE FUNCTION public._archive_noun(p_table text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO ''
AS $function$
  select case p_table
    when 'authorized_accounts'     then 'account'
    when 'curriculum_subjects'     then 'subject'
    when 'enrollment_requirements' then 'document checklist item'
    when 'fari_submissions'        then 'assessment submission'
    when 'fari_ai_analyses'        then 'assessment analysis'
    when 'form138_grades'          then 'Form 138 record'
    when 'graduating_students'     then 'graduating-list entry'
    when 'scholar_batch'           then 'scholar'
    when 'student_profiles'        then 'student profile'
    when 'counseling_records'      then 'counseling record'
    when 'employment_surveys'      then 'employment survey'
    when 'temp_exam_accounts'      then 'exam account'
    else regexp_replace(replace(p_table, '_', ' '), 's$', '')
  end
$function$
;

CREATE OR REPLACE FUNCTION public._archive_restore_account(p_data jsonb, p_related jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_item jsonb;
begin
  if exists (select 1 from public.authorized_accounts where lower(email) = lower(p_data->>'email')) then
    raise exception 'An account for % already exists, so the archived one was not restored.', p_data->>'email';
  end if;
  perform public._archive_insert('authorized_accounts', p_data, false);

  for v_item in select value from jsonb_array_elements(coalesce(p_related #> '{account,users}', '[]'::jsonb)) loop
    update public.users set is_active = coalesce((v_item->>'is_active')::boolean, is_active)
    where id = (v_item->>'id')::uuid;
  end loop;
  for v_item in select value from jsonb_array_elements(coalesce(p_related #> '{account,auth_users}', '[]'::jsonb)) loop
    update auth.users set banned_until = (v_item->>'banned_until')::timestamptz
    where id = (v_item->>'id')::uuid;
  end loop;
end;
$function$
;

CREATE OR REPLACE FUNCTION public._archive_restore_related(p_table text, p_id uuid, p_related jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_item jsonb;
  v_row  jsonb;
  v_rel  jsonb;
begin
  for v_item in select value from jsonb_array_elements(coalesce(p_related->'cascade', '[]'::jsonb)) loop
    for v_row in select value from jsonb_array_elements(coalesce(v_item->'rows', '[]'::jsonb)) loop
      perform public._archive_insert(v_item->>'table', v_row, true);
    end loop;
    for v_rel in select value from jsonb_array_elements(coalesce(v_item->'nested', '[]'::jsonb)) loop
      perform public._archive_restore_related(v_item->>'table', (v_rel->>'id')::uuid, v_rel->'related');
    end loop;
  end loop;

  for v_item in select value from jsonb_array_elements(coalesce(p_related->'relink', '[]'::jsonb)) loop
    continue when v_item->'ids' is null or jsonb_typeof(v_item->'ids') <> 'array';
    execute format('update public.%I set %I = $1 where id::text in (select jsonb_array_elements_text($2)) and %I is null',
                   v_item->>'table', v_item->>'column', v_item->>'column')
      using p_id, v_item->'ids';
  end loop;
end;
$function$
;

CREATE OR REPLACE FUNCTION public._archive_restore_row(p_table text, p_data jsonb, p_related jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  fk       record;
  v_data   jsonb := p_data;
  v_val    text;
  v_exists boolean;
begin
  if p_table = 'authorized_accounts' then
    perform public._archive_restore_account(p_data, p_related);
    return;
  end if;

  execute format('select exists (select 1 from public.%I where id = $1)', p_table)
    into v_exists using (p_data->>'id')::uuid;
  if v_exists then
    raise exception 'This % already exists (same ID), so it was not restored. The archived copy was kept.',
      public._archive_noun(p_table);
  end if;

  for fk in
    select a.attname::text as col, pn.nspname::text as parent_schema, pc.relname::text as parent,
           pa.attname::text as parent_col, not a.attnotnull as nullable
    from pg_constraint c
    join pg_attribute a  on a.attrelid = c.conrelid and a.attnum = c.conkey[1]
    join pg_class pc     on pc.oid = c.confrelid
    join pg_namespace pn on pn.oid = pc.relnamespace
    join pg_attribute pa on pa.attrelid = c.confrelid and pa.attnum = c.confkey[1]
    where c.contype = 'f' and c.conrelid = ('public.' || p_table)::regclass
      and array_length(c.conkey, 1) = 1
  loop
    v_val := v_data->>fk.col;
    continue when v_val is null;
    execute format('select exists (select 1 from %I.%I where %I::text = $1)', fk.parent_schema, fk.parent, fk.parent_col)
      into v_exists using v_val;
    continue when v_exists;
    if fk.parent_schema = 'public' and (
         exists (select 1 from public.archived_records where source_table = fk.parent and source_id::text = v_val)
      or exists (select 1 from public.archive_vault    where source_table = fk.parent and source_id::text = v_val)) then
      raise exception 'Restore the linked % first. It is still in the archive.', public._archive_noun(fk.parent);
    end if;
    if fk.nullable then
      v_data := jsonb_set(v_data, array[fk.col], 'null'::jsonb);
    else
      raise exception 'This % can''t be restored: its linked % no longer exists.',
        public._archive_noun(p_table), public._archive_noun(fk.parent);
    end if;
  end loop;

  perform public._archive_insert(p_table, v_data, false);
  perform public._archive_restore_related(p_table, (p_data->>'id')::uuid, p_related);
end;
$function$
;

CREATE OR REPLACE FUNCTION public._archive_role_of(p_uid uuid)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select u.role
  from public.users u
  join public.authorized_accounts a on a.email = lower(u.email)
  where u.id = p_uid and u.is_active and a.is_active and a.role = u.role
  limit 1;
$function$
;

CREATE OR REPLACE FUNCTION public._archive_summary(p_data jsonb)
 RETURNS jsonb
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO ''
AS $function$
  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb)
  from jsonb_each(coalesce(p_data, '{}'::jsonb))
  where jsonb_typeof(value) in ('string', 'number', 'boolean')
    and length(value::text) <= 200;
$function$
;

CREATE OR REPLACE FUNCTION public.archive_account(p_account_id uuid, p_reason text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_acc        public.authorized_accounts;
  v_caller     text;
  v_ids        uuid[];
  v_users      jsonb;
  v_auth       jsonb;
  v_archive_id uuid;
begin
  if coalesce(public._active_caller_role(), '') <> 'superuser' then
    raise exception 'Only the Superuser can archive accounts.' using errcode = '42501';
  end if;

  select * into v_acc from public.authorized_accounts where id = p_account_id;
  if not found then
    raise exception 'Account not found.';
  end if;

  select lower(email) into v_caller from auth.users where id = auth.uid();
  select coalesce(array_agg(id), '{}') into v_ids from auth.users where lower(email) = lower(v_acc.email);
  if lower(v_acc.email) = v_caller or auth.uid() = any (v_ids) then
    raise exception 'You cannot archive your own account.';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object('id', id, 'is_active', is_active)), '[]'::jsonb) into v_users
  from public.users where lower(email) = lower(v_acc.email) or id = any (v_ids);
  select coalesce(jsonb_agg(jsonb_build_object('id', id, 'banned_until', banned_until)), '[]'::jsonb) into v_auth
  from auth.users where id = any (v_ids);

  insert into public.archived_records (source_table, source_id, archived_data, related, archived_by, archived_by_email, archive_reason)
  values ('authorized_accounts', v_acc.id, to_jsonb(v_acc),
          jsonb_build_object('account', jsonb_build_object('users', v_users, 'auth_users', v_auth)),
          auth.uid(), v_caller, p_reason)
  returning id into v_archive_id;

  delete from public.authorized_accounts where id = v_acc.id;
  update public.users set is_active = false where lower(email) = lower(v_acc.email) or id = any (v_ids);
  update auth.users set banned_until = '2999-12-31'::timestamptz where id = any (v_ids);
  delete from auth.sessions where user_id = any (v_ids);

  insert into public.audit_logs (action, actor_id, actor_email, target_email, table_name, record_id, details)
  values ('archive_account', auth.uid(), v_caller, v_acc.email, 'authorized_accounts', v_acc.id,
          'Account archived: role=' || v_acc.role || '; sign-ins blocked=' || coalesce(array_length(v_ids, 1), 0)
          || coalesce('; reason=' || p_reason, ''));

  return v_archive_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.archive_modules()
 RETURNS TABLE(source_table text, total bigint, archived bigint, date_columns text[])
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_role text := public._active_caller_role();
  t text;
begin
  if v_role is null then
    raise exception 'Not allowed: sign in with an active staff account.' using errcode = '42501';
  end if;
  foreach t in array array[
    'leads', 'enrollments', 'scholarships', 'scholar_batch', 'student_profiles',
    'schools', 'reports', 'fari_submissions', 'employment_surveys',
    'graduating_students', 'users', 'curriculum_subjects', 'form138_grades',
    'counseling_records']
  loop
    continue when not public._archive_allowed(v_role, t);
    source_table := t;
    execute format('select count(*) from public.%I', t) into total;
    select count(*) into archived from public.archived_records a where a.source_table = t;
    date_columns := public._archive_date_columns(t);
    return next;
  end loop;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.archive_record(p_source_table text, p_source_id uuid, p_reason text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_row        jsonb;
  v_related    jsonb;
  v_archive_id uuid;
  v_user_email text;
  v_role       text := public._active_caller_role();
begin
  if v_role is null then
    raise exception 'Not allowed: sign in with an active staff account.' using errcode = '42501';
  end if;
  if p_source_table = 'authorized_accounts' then
    raise exception 'Accounts are archived from Account Management.' using errcode = '42501';
  end if;
  if not public._archive_allowed(v_role, p_source_table) then
    raise exception 'Not allowed: % cannot archive %.', v_role, public._archive_noun(p_source_table) using errcode = '42501';
  end if;

  execute format('select to_jsonb(t) from public.%I t where id = $1', p_source_table)
    into v_row using p_source_id;
  if v_row is null then
    raise exception 'This % was not found; it may already be archived.', public._archive_noun(p_source_table);
  end if;

  v_related := public._archive_collect_related(p_source_table, p_source_id);

  select email into v_user_email from auth.users where id = auth.uid();

  insert into public.archived_records (source_table, source_id, archived_data, related, archived_by, archived_by_email, archive_reason)
  values (p_source_table, p_source_id, v_row, v_related, auth.uid(), v_user_email, nullif(trim(p_reason), ''))
  returning id into v_archive_id;

  insert into public.audit_logs (action, actor_id, actor_email, target_id, details)
  values ('ARCHIVE', auth.uid(), v_user_email, p_source_id,
          jsonb_build_object('table', p_source_table, 'reason', p_reason, 'archive_id', v_archive_id)::text)
  on conflict do nothing;

  execute format('delete from public.%I where id = $1', p_source_table) using p_source_id;
  return v_archive_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.archive_vault_commit(p_archive_id uuid, p_path text, p_size bigint, p_sha256 text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.archive_vault (id, source_table, source_id, summary, archived_at, archived_by,
                                    archived_by_email, archive_reason, storage_path, size_bytes, sha256)
  select id, source_table, source_id, public._archive_summary(archived_data), archived_at, archived_by,
         archived_by_email, archive_reason, p_path, p_size, p_sha256
  from public.archived_records where id = p_archive_id;
  if not found then
    raise exception 'Archive record % not found', p_archive_id;
  end if;
  delete from public.archived_records where id = p_archive_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.archive_vault_cron_ok(p_secret text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(p_secret, '') <> ''
     and p_secret = (select decrypted_secret from vault.decrypted_secrets where name = 'archive_vault_cron_secret');
$function$
;

CREATE OR REPLACE FUNCTION public.archive_vault_restore(p_vault_id uuid, p_payload jsonb, p_actor uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_entry public.archive_vault%rowtype;
begin
  if coalesce(public._archive_role_of(p_actor), '') <> 'superuser' then
    raise exception 'Not allowed: only the Superuser can restore archived records.' using errcode = '42501';
  end if;
  select * into v_entry from public.archive_vault where id = p_vault_id;
  if not found then
    raise exception 'Long-term archive entry % not found', p_vault_id;
  end if;
  if (p_payload #>> '{archive,id}') is distinct from p_vault_id::text
     or (p_payload #>> '{archive,source_table}') is distinct from v_entry.source_table then
    raise exception 'The archive file does not match its index entry.';
  end if;

  delete from public.archive_vault where id = p_vault_id;
  perform public._archive_restore_row(v_entry.source_table, p_payload->'data', coalesce(p_payload->'related', '{}'::jsonb));

  insert into public.audit_logs (action, actor_id, target_id, details)
  values ('RESTORE', p_actor, v_entry.source_id,
          'Restored from long-term archive: ' || v_entry.source_table || ' (archive_id: ' || p_vault_id::text || ')')
  on conflict do nothing;
  return v_entry.storage_path;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.at_risk_key(p_student_id text, p_first text, p_last text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE
AS $function$
  select case when coalesce(p_student_id, '') <> '' then 'id:' || public.sm_clean_id(p_student_id)
              else 'nm:' || public.sm_key_parts(p_first, p_last) end;
$function$
;
