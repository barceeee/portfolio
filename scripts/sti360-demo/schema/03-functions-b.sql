-- Functions read from the live catalog (pg_get_functiondef), part B.
CREATE OR REPLACE FUNCTION public.at_risk_rows(p_school_year text DEFAULT NULL::text, p_semester text DEFAULT NULL::text)
 RETURNS TABLE(key text, name text, student_id text, email text, lrn text, course text, year_level text, reasons text[], details text[], unreviewed boolean, fari_ids uuid[], fari jsonb)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with
  enr0 as (
    select e.*,
      (substring(e.school_year from '(\d{4})'))::int * 3 +
        case left(lower(trim(coalesce(e.semester, ''))), 1) when '1' then 0 when '2' then 1 when 's' then 2 end as t_order,
      coalesce(ec.classification, case when e.student_type = 'Irregular' then 'Irregular' else 'Regular' end) as stype,
      sm_clean_id(e.student_id) as cid,
      sm_key_parts(e.first_name, e.last_name) as nk
    from enrollments e
    left join enrollment_classification ec on ec.enrollment_id = e.id
  ),
  enr as (
    select e0.*, case when coalesce(e0.student_id, '') <> '' then 'id:' || e0.cid else 'nm:' || e0.nk end as k
    from enr0 e0
  ),
  newest as (
    select enr.*, row_number() over (order by coalesce(t_order, -1) desc, id) as pos from enr
  ),
  email_of as (
    select distinct on (k) k, email from newest where coalesce(email, '') <> '' order by k, pos
  ),
  base_of as (
    select n.id,
      coalesce(nullif(concat_ws(', ', nullif(n.last_name, ''), nullif(n.first_name, '')), ''), 'Unnamed') as name,
      coalesce(n.student_id, '') as student_id, coalesce(n.email, '') as email,
      coalesce(nullif(n.course, ''), '—') as course,
      coalesce(nullif(n.year_level, ''), nullif(n.grade_level, ''), '—') as year_level
    from enr n
  ),
  rs as (select * from retention_students(p_school_year, p_semester)),
  latest_tr as (select max(from_order) o from rs where not in_progress),
  f_nr as (
    select e.k, r.enrollment_id as eid, 1 as pri,
           row_number() over (order by r.display_name, r.enrollment_id) as seq,
           'not_returned' as reason,
           'Enrolled ' || r.from_sy || ' · ' || r.from_sem || ', not enrolled ' || r.to_sy || ' · ' || r.to_sem as detail,
           false as unrev, null::uuid as fid, null::timestamptz as fat
    from rs r
    join latest_tr t on r.from_order = t.o
    join enr e on e.id = r.enrollment_id
    where not r.completed and not r.returned
  ),
  f_irr as (
    select e.k, e.id as eid, 2 as pri, row_number() over (order by e.id) as seq,
           'irregular' as reason,
           'Irregular student, enrolled ' || coalesce(e.school_year, '') || ' ' || coalesce(e.semester, '') as detail,
           false as unrev, null::uuid as fid, null::timestamptz as fat
    from enr e
    where e.stype = 'Irregular' and e.t_order = (select max(t_order) from enr)
  ),
  grit as (
    select coalesce(array_agg(id::text order by item_number), '{}') ids
    from (select id, item_number from fari_questions where section_key = 'psychometric' order by item_number limit 10) q
  ),
  subs as materialized (
    select s, a.source, a.source_id, a.enrollment_id as acct_enr,
           sm_clean_id(s.student_lrn) as lrn_id,
           sm_key_full(s.student_name) as name_key,
           sm_key_surname_first(s.student_name) as name_key2
    from fari_submissions s
    left join temp_exam_accounts a on a.id = s.temp_account_id
  ),
  matched as (
    select x.s,
      coalesce(
        (select e.id from enr e where e.id = x.acct_enr),
        case when x.source = 'enrollee' then (select e.id from enr e where e.id = x.source_id) end,
        case when x.source = 'lead' then (select e.id from enr e where e.lead_id = x.source_id order by e.id desc limit 1) end,
        case when x.lrn_id <> '' then
          (select n.id from newest n where n.cid = x.lrn_id order by n.pos limit 1) end,
        case when x.name_key <> '' then
          (select n.id from newest n where n.nk = x.name_key order by n.pos limit 1) end,
        case when x.name_key2 <> '' then
          (select n.id from newest n where n.nk = x.name_key2 order by n.pos limit 1) end
      ) as eid
    from subs x
  ),
  fari_read as (
    select m.s, m.eid, e.k as ek,
           fari_flag_labels(m.s, (select ids from grit), e.course) as flags,
           lower(coalesce((m.s).zone, '')) = 'red' as is_red
    from matched m left join enr e on e.id = m.eid
  ),
  f_fari as (
    select
      coalesce(fr.ek, 'fari:' || coalesce(nullif((fr.s).student_lrn, ''), nullif(sm_key_full((fr.s).student_name), ''), (fr.s).id::text)) as k,
      fr.eid, 3 as pri, row_number() over (order by (fr.s).submitted_at, (fr.s).id) as seq,
      case when fr.is_red then 'red_zone' else 'fari_flag' end as reason,
      'FARI ' ||
        case when not fr.is_red then lower(coalesce((fr.s).zone, '')) || ' zone, ' else '' end ||
        case when (fr.s).wss is not null then 'score ' || to_char(round((fr.s).wss::numeric, 1), 'FM999990.0') || ' / 100'
             else coalesce(nullif((fr.s).zone, ''), 'no') || ' zone' end ||
        case when (fr.s).submitted_at is not null
             then ' on ' || to_char((fr.s).submitted_at at time zone 'Asia/Manila', 'FMMM/FMDD/YYYY') else '' end ||
        case when fr.is_red then
          ' · ' || case when (fr.s).status = 'finalized'
                        then 'reviewed by ' || coalesce(nullif((fr.s).reviewed_by_email, ''), 'staff')
                        else 'not yet reviewed' end
        else '' end ||
        case when cardinality(fr.flags) > 0 then ' · ' || array_to_string(fr.flags, ', ') else '' end as detail,
      fr.is_red and (fr.s).status is distinct from 'finalized' as unrev,
      (fr.s).id as fid, (fr.s).submitted_at as fat
    from fari_read fr
    where fr.is_red or cardinality(fr.flags) > 0
  ),
  flags as (
    select * from f_nr union all select * from f_irr union all select * from f_fari
  ),
  firsts as (
    select distinct on (f.k) f.k, f.eid, f.fid
    from flags f order by f.k, f.pri, f.seq
  ),
  agg as (
    select f.k,
      array(select r from (select f2.reason r, min(f2.pri * 100000 + f2.seq) o from flags f2 where f2.k = f.k group by f2.reason) z order by o) as reasons,
      array_agg(f.detail order by f.pri, f.seq) as details,
      bool_or(f.unrev) as unreviewed,
      coalesce(array_agg(f.fid order by f.pri, f.seq) filter (where f.fid is not null), '{}') as fari_ids,
      (array_agg(f.fid order by f.fat desc nulls last, f.fid) filter (where f.fid is not null))[1] as newest_fid
    from flags f group by f.k
  )
  select
    a.k,
    coalesce(b.name, coalesce(nullif(s.student_name, ''), 'Unnamed')),
    coalesce(b.student_id, ''),
    coalesce(nullif(b.email, ''), eo.email, ''),
    case when b.id is null then coalesce(s.student_lrn, '') else '' end,
    coalesce(b.course, 'Not enrolled yet'),
    coalesce(b.year_level, '—'),
    a.reasons, a.details, a.unreviewed, a.fari_ids,
    (select to_jsonb(fs) from fari_submissions fs where fs.id = a.newest_fid)
  from agg a
  join firsts fi on fi.k = a.k
  left join base_of b on b.id = fi.eid
  left join email_of eo on eo.k = a.k
  left join fari_submissions s on s.id = fi.fid and fi.eid is null;
$function$
;

CREATE OR REPLACE FUNCTION public.check_archived_enrollment(p_student_id text, p_school_year text, p_semester text)
 RETURNS TABLE(archived_at timestamp with time zone, reason text, location text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if coalesce(public._active_caller_role(), '') not in ('admin', 'superuser', 'frontdesk') then
    raise exception 'Not allowed.' using errcode = '42501';
  end if;
  return query
    select x.archived_at, x.reason, x.location from (
      select ar.archived_at, ar.archive_reason as reason, 'archive'::text as location
      from public.archived_records ar
      where ar.source_table = 'enrollments'
        and lower(ar.archived_data->>'student_id') = lower(p_student_id)
        and ar.archived_data->>'school_year' = p_school_year
        and ar.archived_data->>'semester' = p_semester
      union all
      select v.archived_at, v.archive_reason, 'long-term storage'
      from public.archive_vault v
      where v.source_table = 'enrollments'
        and lower(v.summary->>'student_id') = lower(p_student_id)
        and v.summary->>'school_year' = p_school_year
        and v.summary->>'semester' = p_semester
    ) x
    order by x.archived_at desc
    limit 1;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.check_archived_scholar(p_email text, p_scholarship text)
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
  select ar.id, ar.source_id, ar.archived_at, ar.archive_reason as reason
  from public.archived_records ar
  where ar.source_table = 'scholar_batch'
    and ar.archived_data->>'email' ilike p_email
    and lower(coalesce(ar.archived_data->>'scholarship_type', '')) = lower(coalesce(p_scholarship, ''))
  order by ar.archived_at desc
  limit 1;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.counseling_cases(p_school_year text DEFAULT NULL::text, p_semester text DEFAULT NULL::text, p_today date DEFAULT CURRENT_DATE)
 RETURNS TABLE(key text, name text, student_id text, email text, lrn text, course text, year_level text, reasons text[], details text[], unreviewed boolean, fari_ids uuid[], fari jsonb, "case" jsonb, sessions jsonb, status text, is_due boolean, reasons_count integer, search_text text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select
    r.key, r.name, r.student_id, r.email, r.lrn, r.course, r.year_level,
    r.reasons, r.details, r.unreviewed, r.fari_ids, r.fari,
    to_jsonb(c) as "case",
    coalesce((select jsonb_agg(to_jsonb(x) order by x.session_date desc, x.created_at desc)
              from (select id, case_key, session_date, session_type, concern, counselor_notes, follow_up_date, created_at
                    from counseling_records where case_key = r.key) x), '[]'::jsonb) as sessions,
    coalesce(c.status, 'new') as status,
    (c.follow_up_date is not null and c.status is distinct from 'resolved' and c.follow_up_date <= p_today) as is_due,
    cardinality(r.reasons) as reasons_count,
    lower(concat_ws(' ', r.name, r.student_id, r.lrn, r.email, r.course)) as search_text
  from at_risk_rows(p_school_year, p_semester) r
  left join at_risk_cases c on c.case_key = r.key;
$function$
;

CREATE OR REPLACE FUNCTION public.counseling_counts(p_school_year text DEFAULT NULL::text, p_semester text DEFAULT NULL::text, p_today date DEFAULT CURRENT_DATE)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select jsonb_build_object(
    'all',           count(*),
    'open',          count(*) filter (where status <> 'resolved'),
    'due',           count(*) filter (where is_due),
    'in_counseling', count(*) filter (where status = 'in_counseling'),
    'resolved',      count(*) filter (where status = 'resolved'),
    'unreviewed',    count(*) filter (where unreviewed),
    'not_returned',  count(*) filter (where 'not_returned' = any(reasons)),
    'red_zone',      count(*) filter (where 'red_zone' = any(reasons)),
    'fari_flag',     count(*) filter (where 'fari_flag' = any(reasons)),
    'irregular',     count(*) filter (where 'irregular' = any(reasons))
  )
  from counseling_cases(p_school_year, p_semester, p_today);
$function$
;

CREATE OR REPLACE FUNCTION public.deactivate_inactive_accounts(p_days integer DEFAULT 30)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_count integer;
begin
  with stale as (
    select aa.id
    from public.authorized_accounts aa
    left join lateral (
      select max(u.last_sign_in_at) as last_sign_in_at
      from auth.users u
      where lower(u.email) = aa.email
    ) s on true
    where aa.is_active
      and aa.role in ('frontdesk', 'marketing', 'guidance')
      and greatest(
            coalesce(s.last_sign_in_at, '-infinity'::timestamptz),
            coalesce(aa.created_at,     '-infinity'::timestamptz),
            coalesce(aa.updated_at,     '-infinity'::timestamptz)
          ) < now() - make_interval(days => p_days)
  )
  update public.authorized_accounts aa
  set is_active = false,
      deactivation_reason = 'inactivity',
      updated_at = now()
  from stale
  where aa.id = stale.id;

  get diagnostics v_count = row_count;
  return v_count;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.deactivate_inactive_students(p_years integer DEFAULT 6, p_dry_run boolean DEFAULT false)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_count integer;
begin
  if p_years is null or p_years < 1 then
    raise exception 'p_years must be at least 1';
  end if;

  create temporary table if not exists _stale_students (
    id uuid primary key, email text, last_activity timestamptz
  ) on commit drop;
  truncate _stale_students;

  insert into _stale_students (id, email, last_activity)
  select aa.id, aa.email, act.last_activity
  from public.authorized_accounts aa
  cross join lateral (
    select greatest(
      coalesce((select max(u.last_sign_in_at) from auth.users u
                where lower(u.email) = aa.email), '-infinity'::timestamptz),
      coalesce((select max(greatest(s.updated_at, s.refreshed_at))
                from auth.sessions s join auth.users u on u.id = s.user_id
                where lower(u.email) = aa.email), '-infinity'::timestamptz),
      coalesce(aa.created_at, '-infinity'::timestamptz),
      coalesce(aa.updated_at, '-infinity'::timestamptz)
    ) as last_activity
  ) act
  where aa.role = 'student'
    and aa.is_active
    and act.last_activity < now() - make_interval(years => p_years);

  if p_dry_run then
    select count(*) into v_count from _stale_students;
    return v_count;
  end if;

  update public.authorized_accounts aa
  set is_active = false,
      deactivation_reason = 'inactivity',
      updated_at = now()
  from _stale_students st
  where aa.id = st.id
    and aa.role = 'student';

  get diagnostics v_count = row_count;

  insert into public.audit_logs (action, actor_id, actor_email, target_email, table_name, record_id, details)
  select 'student_auto_deactivated', null, 'system', st.email, 'authorized_accounts', st.id,
         'Student account deactivated automatically: no activity for ' || p_years ||
         ' years (last activity ' ||
         case when st.last_activity = '-infinity'::timestamptz then 'never'
              else to_char(st.last_activity at time zone 'Asia/Manila', 'Mon DD, YYYY') end ||
         ').'
  from _stale_students st;

  return v_count;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.documents_tab_stats()
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select jsonb_build_object(
    'total',    count(*),
    'received', count(*) filter (where form138_status = 'received'),
    'review',   count(*) filter (where form138_status = 'received'
                                   and form138_extraction_status = 'needs_review')
  )
  from document_students_v;
$function$
;
