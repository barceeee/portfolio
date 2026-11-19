-- Functions read from the live catalog (pg_get_functiondef), part E.
CREATE OR REPLACE FUNCTION public.link_user_id_from_email()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
begin
  if new.user_id is null and new.email is not null then
    select id into new.user_id from auth.users where lower(email) = lower(new.email) limit 1;
  end if;
  return new;
end $function$
;

CREATE OR REPLACE FUNCTION public.log_table_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_new      jsonb := CASE WHEN TG_OP <> 'DELETE' THEN to_jsonb(NEW) END;
  v_old      jsonb := CASE WHEN TG_OP <> 'INSERT' THEN to_jsonb(OLD) END;
  v_row      jsonb := COALESCE(v_new, v_old);
  v_action   text;
  v_changed  text[];
  v_label    text;
  v_details  text;
  v_record   uuid;
BEGIN
  IF current_setting('sti.skip_audit', true) = 'on' THEN
    RETURN NULL;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    -- Which columns actually changed (ignore bookkeeping timestamps).
    SELECT array_agg(key ORDER BY key) INTO v_changed
    FROM jsonb_each(v_new) n
    WHERE n.value IS DISTINCT FROM v_old -> n.key
      AND n.key NOT IN ('updated_at', 'last_seen_at', 'last_login_at');

    IF v_changed IS NULL THEN
      RETURN NULL;  -- nothing meaningful changed
    END IF;
  END IF;

  v_action := CASE TG_OP
    WHEN 'INSERT' THEN 'create'
    WHEN 'UPDATE' THEN 'update'
    ELSE 'delete'
  END;

  -- A human-readable label for the affected row, if the table has one.
  v_label := NULLIF(trim(concat_ws(' ',
    COALESCE(v_row ->> 'first_name', ''),
    COALESCE(v_row ->> 'last_name', '')
  )), '');
  v_label := COALESCE(
    v_label,
    v_row ->> 'full_name',
    v_row ->> 'student_name',
    v_row ->> 'name',
    v_row ->> 'school_name',
    v_row ->> 'title',
    v_row ->> 'student_id',
    v_row ->> 'email'
  );

  v_details := TG_TABLE_NAME || ': ' ||
    CASE TG_OP
      WHEN 'INSERT' THEN 'created record'
      WHEN 'DELETE' THEN 'deleted record'
      ELSE 'updated ' || array_to_string(v_changed, ', ')
    END ||
    COALESCE(' (' || v_label || ')', '');

  -- record_id is uuid; some tables use integer ids.
  BEGIN
    v_record := (v_row ->> 'id')::uuid;
  EXCEPTION WHEN OTHERS THEN
    v_record := NULL;
    v_details := v_details || ' [id ' || COALESCE(v_row ->> 'id', '?') || ']';
  END;

  -- Never block the user's change because logging failed.
  BEGIN
    INSERT INTO public.audit_logs (action, actor_id, target_email, table_name, record_id, details)
    VALUES (v_action, auth.uid(), v_row ->> 'email', TG_TABLE_NAME, v_record, v_details);
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.marketing_lead_stats()
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with l as (
    select status, coalesce(source, 'other') as source,
           row_number() over (order by created_at desc, id) as pos
    from leads
  )
  select jsonb_build_object(
    'total',    (select count(*) from l),
    'by_status', coalesce((select jsonb_agg(jsonb_build_object('key', k, 'count', n) order by n desc, p)
                             from (select coalesce(status, 'new') k, count(*) n, min(pos) p from l group by 1) t), '[]'::jsonb),
    'by_source', coalesce((select jsonb_agg(jsonb_build_object('key', k, 'count', n) order by n desc, p)
                             from (select source k, count(*) n, min(pos) p from l group by 1) t), '[]'::jsonb),
    'feeder_schools', (select count(*) from schools where type = 'feeder')
  );
$function$
;

CREATE OR REPLACE FUNCTION public.marketing_school_counts()
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select jsonb_build_object(
    'total',      count(*),
    'feeder',     count(*) filter (where type = 'feeder'),
    'non_feeder', count(*) filter (where type = 'non-feeder'),
    'competitor', count(*) filter (where type = 'competition')
  )
  from schools;
$function$
;

CREATE OR REPLACE FUNCTION public.prevent_sti_delete()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  if old.name = 'STI College Alabang' then
    raise exception 'STI College Alabang record cannot be deleted';
  end if;
  return old;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.prevent_sti_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  if old.name = 'STI College Alabang' then
    raise exception 'STI College Alabang record cannot be modified';
  end if;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.report_account_microsoft_disabled(p_email text, p_details text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_email text := lower(trim(p_email));
  v_id    uuid;
  v_role  text;
begin
  update public.authorized_accounts
  set is_active = false,
      deactivation_reason = 'microsoft_disabled',
      updated_at = now()
  where email = v_email
    and role in ('frontdesk', 'marketing', 'guidance', 'student')
    and is_active
  returning id, role into v_id, v_role;

  if v_id is null then
    return;
  end if;

  insert into public.audit_logs (action, actor_id, actor_email, target_email, table_name, record_id, details)
  values ('account_microsoft_disabled', null, 'system', v_email, 'authorized_accounts', v_id,
          initcap(v_role) || ' account deactivated automatically: ' || coalesce(p_details, 'Microsoft account disabled') || '.');
end;
$function$
;

CREATE OR REPLACE FUNCTION public.restore_archived_record(p_archive_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_rec public.archived_records%rowtype;
begin
  if coalesce(public._active_caller_role(), '') <> 'superuser' then
    raise exception 'Not allowed: only the Superuser can restore archived records.' using errcode = '42501';
  end if;

  select * into v_rec from public.archived_records where id = p_archive_id;
  if not found then
    raise exception 'Archive record % not found', p_archive_id;
  end if;

  delete from public.archived_records where id = p_archive_id;
  perform public._archive_restore_row(v_rec.source_table, v_rec.archived_data, v_rec.related);

  insert into public.audit_logs (action, actor_id, target_id, details)
  values ('RESTORE', auth.uid(), v_rec.source_id,
          'Restored from archive: ' || v_rec.source_table || ' (archive_id: ' || p_archive_id::text || ')')
  on conflict do nothing;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.retention_clean(v text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
  select regexp_replace(
           translate(lower(coalesce(v, '')),
                     'áàâäãåéèêëíìîïóòôöõúùûüñç', 'aaaaaaeeeeiiiiooooouuuunc'),
           '[^a-z0-9]', '', 'g');
$function$
;

CREATE OR REPLACE FUNCTION public.retention_students(p_school_year text DEFAULT NULL::text, p_semester text DEFAULT NULL::text)
 RETURNS TABLE(from_order integer, from_sy text, from_sem text, to_sy text, to_sem text, in_progress boolean, enrollment_id uuid, student_id text, first_name text, last_name text, email text, display_name text, course text, year_level text, student_type text, completed boolean, returned boolean)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with base as (
    select
      e.*,
      (substring(e.school_year from '(\d{4})'))::int as y,
      case
        when left(lower(trim(coalesce(e.semester, ''))), 1) = '1' then 0
        when left(lower(trim(coalesce(e.semester, ''))), 1) = '2' then 1
        when left(lower(trim(coalesce(e.semester, ''))), 1) = 's' then 2
      end as s
    from enrollments e
  ),
  rows as (
    select
      b.*,
      b.y * 3 + b.s as t_order,
      'nm:' || retention_clean(b.last_name) || '|' || retention_clean(b.first_name) as name_key,
      case when nullif(trim(coalesce(b.student_id, '')), '') is not null
           then 'id:' || retention_clean(b.student_id)
           else 'nm:' || retention_clean(b.last_name) || '|' || retention_clean(b.first_name)
      end as skey,
      case when b.s = 0 then b.y * 3 + 1 else (b.y + 1) * 3 end as next_order
    from base b
    where b.y is not null and b.s is not null
  ),
  terms as (
    select distinct on (t_order) t_order, school_year, semester
    from rows
    order by t_order, id
  ),
  term_keys as (
    select t_order, 'id:' || retention_clean(student_id) as k from rows where coalesce(student_id, '') <> ''
    union
    select t_order, name_key from rows
  ),
  reps as (
    select distinct on (t_order, skey) *
    from rows
    order by t_order, skey, id desc
  ),
  active as (
    select (substring(p_school_year from '(\d{4})'))::int * 3 +
           case left(lower(trim(coalesce(p_semester, ''))), 1) when '1' then 0 when '2' then 1 when 's' then 2 end
           as a_order
  ),
  classified as (
    select
      r.*,
      coalesce(ec.classification,
               case when r.student_type = 'Irregular' then 'Irregular' else 'Regular' end) as stype,
      lower(coalesce(nullif(r.year_level, ''), r.grade_level, '')) as yl
    from reps r
    left join enrollment_classification ec on ec.enrollment_id = r.id
  ),
  flagged as (
    select
      c.*,
      ((c.yl like '4%' or c.yl like '%fourth%' or c.yl like '%12%') and c.s = 1) as is_final,
      (exists (select 1 from term_keys k where k.t_order = c.next_order and k.k = c.skey)
       or exists (select 1 from term_keys k where k.t_order = c.next_order and k.k = c.name_key)) as came_back
    from classified c
    where exists (select 1 from terms t where t.t_order = c.next_order)
  ),
  live as (
    select t_order from flagged group by t_order having count(*) filter (where not is_final) > 0
  )
  select
    f.t_order,
    ft.school_year, ft.semester,
    nt.school_year, nt.semester,
    (a.a_order is not null and f.next_order >= a.a_order),
    f.id, f.student_id, f.first_name, f.last_name, f.email,
    coalesce(nullif(concat_ws(', ', nullif(f.last_name, ''), nullif(f.first_name, '')), ''), 'Unnamed'),
    coalesce(nullif(f.course, ''), 'Unknown'),
    coalesce(nullif(f.year_level, ''), nullif(f.grade_level, ''), '—'),
    f.stype,
    f.is_final,
    f.came_back
  from flagged f
  join live l on l.t_order = f.t_order
  join terms ft on ft.t_order = f.t_order
  join terms nt on nt.t_order = f.next_order
  cross join active a;
$function$
;
