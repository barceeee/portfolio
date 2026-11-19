-- Functions read from the live catalog (pg_get_functiondef), part C.
CREATE OR REPLACE FUNCTION public.employment_survey_stats(p_school_year text DEFAULT NULL::text, p_status text DEFAULT NULL::text, p_search text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select jsonb_build_object(
    'total',      count(*),
    'employed',   count(*) filter (where employment_status in ('Employed', 'Self-employed')),
    'looking',    count(*) filter (where looking_for_job),
    'abroad',     count(*) filter (where employment_location = 'Abroad'),
    'avg_salary', round(avg(monthly_salary) filter (where monthly_salary is not null and monthly_salary <> 0))
  )
  from employment_surveys_v
  where (coalesce(p_school_year, '') = '' or school_year = p_school_year)
    and (coalesce(p_status, '') = '' or employment_status = p_status)
    and (coalesce(p_search, '') = '' or search_text like '%' || lower(p_search) || '%');
$function$
;

CREATE OR REPLACE FUNCTION public.enrollment_match_candidates(p_email text DEFAULT ''::text, p_phone10 text DEFAULT ''::text, p_words text[] DEFAULT '{}'::text[])
 RETURNS TABLE(id uuid, first_name text, last_name text, email text, phone text, student_id text, course text, year_level text, school_year text, semester text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select e.id, e.first_name, e.last_name, e.email, e.phone,
         e.student_id, e.course, e.year_level, e.school_year, e.semester
  from enrollments e
  where (coalesce(p_email, '') <> '' and lower(trim(e.email)) = p_email)
     or (coalesce(p_phone10, '') <> ''
         and right(regexp_replace(coalesce(e.phone, ''), '\D', '', 'g'), 10) = p_phone10)
     or exists (
       select 1 from unnest(coalesce(p_words, '{}')) w
       where w <> ''
         and translate(lower(coalesce(e.last_name, '')),
                       'áàâäãåéèêëíìîïóòôöõúùûüñç', 'aaaaaaeeeeiiiiooooouuuunc')
             like '%' || w || '%'
     )
  order by e.created_at desc, e.id;
$function$
;

CREATE OR REPLACE FUNCTION public.enrollment_tab_stats(p_school_year text DEFAULT NULL::text, p_semester text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select jsonb_build_object(
    'total_leads',      (select count(*) from leads),
    'leads_by_status',  coalesce((select jsonb_object_agg(status, n)
                                    from (select status, count(*) n from leads group by status) t), '{}'::jsonb),
    'qualified_ready',  (select count(*) from qualified_leads_v),
    'pending_docs',     (select count(*) from leads where status = 'pending_documents'),
    'converted_leads',  (select count(*) from leads l
                           where l.status = 'enrolled'
                              or exists (select 1 from enrollments e where e.lead_id = l.id)),
    'total_enrolled',   (select count(*) from enrollments),
    'term_enrolled',    (select count(*) from enrollments
                           where p_school_year is null
                              or (school_year = p_school_year and semester = p_semester)),
    'year_level_counts', coalesce((select jsonb_object_agg(year_level, n)
                                     from (select year_level, count(*) n from enrollments
                                            where year_level is not null group by year_level) t), '{}'::jsonb),
    'school_years',     coalesce((select jsonb_agg(school_year order by school_year desc)
                                    from (select distinct school_year from enrollments
                                           where school_year is not null and school_year <> '') t), '[]'::jsonb)
  );
$function$
;

CREATE OR REPLACE FUNCTION public.enrollment_year_level_counts(p_school_year text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select jsonb_build_object(
    'total', coalesce(sum(n), 0),
    'by_year_level', coalesce(
      jsonb_object_agg(year_level, n) filter (where year_level is not null),
      '{}'::jsonb
    )
  )
  from (
    select year_level, count(*) n
    from enrollments
    where p_school_year is null or school_year = p_school_year
    group by year_level
  ) t;
$function$
;

CREATE OR REPLACE FUNCTION public.enrollments_fill_term()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$ declare s record; begin if new.school_year is null or new.semester is null then select school_year, semester into s from public.semester_settings where id = 1; if new.school_year is null then new.school_year := s.school_year; end if; if new.semester is null and new.school_year = s.school_year then new.semester := s.semester; end if; end if; return new; end $function$
;

CREATE OR REPLACE FUNCTION public.enrollments_push_school_origin()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  o record;
  v_old text;
begin
  if tg_op = 'UPDATE' then
    if new.school_name is not distinct from old.school_name
       and new.school_id is not distinct from old.school_id then
      return null;
    end if;
    v_old := coalesce((select s.name from public.schools s where s.id = old.school_id), old.school_name);
  end if;

  select * into o from public.enrollment_school_origin(new.id);
  if not found then
    return null;
  end if;

  update public.graduating_students g
     set school_origin = o.school_origin,
         school_origin_type = o.school_origin_type
   where (g.enrollment_id = new.id
          or (new.student_id is not null and g.student_id = new.student_id)
          or (new.student_id is not null and g.enrollment_id in
                (select e.id from public.enrollments e where e.student_id = new.student_id)))
     and (nullif(btrim(g.school_origin), '') is null
          or lower(btrim(g.school_origin)) = lower(btrim(v_old)));

  return null;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.exam_account_find_enrollment(p_source text, p_source_id uuid, p_email text, p_phone text, p_first text, p_last text, p_full text)
 RETURNS TABLE(enrollment_id uuid, linked_by text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_email text := public.exam_email_key(p_email);
  v_phone text := public.exam_phone_key(p_phone);
  v_key   text := public.exam_name_key(p_first, p_last);
  v_words text[];
  v_id    uuid;
begin
  if p_source = 'lead' and p_source_id is not null then
    select e.id into v_id from public.enrollments e
    where e.lead_id = p_source_id order by e.created_at desc limit 1;
    if v_id is not null then return query select v_id, 'lead'; return; end if;
  end if;

  if v_email <> '' then
    select e.id into v_id from public.enrollments e
    where public.exam_email_key(e.email) = v_email order by e.created_at desc limit 1;
    if v_id is not null then return query select v_id, 'email'; return; end if;
  end if;

  if v_key = '' and p_full is not null then
    v_words := public.exam_name_words(p_full);
    if cardinality(v_words) >= 2 then v_key := v_words[1] || '|' || v_words[cardinality(v_words)]; end if;
  end if;

  if v_key <> '' then
    if (select count(distinct coalesce(nullif(lower(e.student_id), ''), nullif(public.exam_email_key(e.email), ''), e.id::text))
        from public.enrollments e where public.exam_name_key(e.first_name, e.last_name) = v_key) = 1 then
      select e.id into v_id from public.enrollments e
      where public.exam_name_key(e.first_name, e.last_name) = v_key order by e.created_at desc limit 1;
      return query select v_id, 'name';
      return;
    end if;
  end if;

  if v_phone <> '' then
    select e.id into v_id from public.enrollments e
    where public.exam_phone_key(e.phone) = v_phone order by e.created_at desc limit 1;
    if v_id is not null then return query select v_id, 'phone'; end if;
  end if;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.exam_email_key(v text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO ''
AS $function$
  select case when v is null or lower(trim(v)) like '%@sti360.local' then '' else lower(trim(v)) end
$function$
;

CREATE OR REPLACE FUNCTION public.exam_name_key(first_name text, last_name text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO ''
AS $function$
  select case
    when cardinality(public.exam_name_words(first_name)) > 0 and cardinality(public.exam_name_words(last_name)) > 0
    then (public.exam_name_words(first_name))[1] || '|' || (public.exam_name_words(last_name))[cardinality(public.exam_name_words(last_name))]
    else ''
  end
$function$
;

CREATE OR REPLACE FUNCTION public.exam_name_words(v text)
 RETURNS text[]
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO ''
AS $function$
  select coalesce(array_agg(w order by ord), '{}')
  from unnest(regexp_split_to_array(
         trim(regexp_replace(
           translate(lower(coalesce(v, '')), 'áàâäãéèêëíìîïóòôöõúùûüñç', 'aaaaaeeeeiiiiooooouuuunc'),
           '[^a-z0-9]+', ' ', 'g')),
         ' ')) with ordinality as t(w, ord)
  where w <> '' and w not in ('jr', 'sr', 'ii', 'iii', 'iv')
$function$
;

CREATE OR REPLACE FUNCTION public.exam_phone_key(v text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO ''
AS $function$
  select case when length(d) >= 10 then right(d, 10) else '' end
  from (select regexp_replace(coalesce(v, ''), '\D', '', 'g') as d) x
$function$
;
