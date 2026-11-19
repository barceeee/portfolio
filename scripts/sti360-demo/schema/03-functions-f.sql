-- Functions read from the live catalog (pg_get_functiondef), part F.
-- (rls_auto_enable, an event-trigger helper, is left out: nothing in the demo creates tables.)
CREATE OR REPLACE FUNCTION public.retention_summary(p_school_year text DEFAULT NULL::text, p_semester text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with s as (select * from retention_students(p_school_year, p_semester)),
  groups as (
    select
      from_order, course, year_level,
      count(*) filter (where not completed)                                         as cohort,
      count(*) filter (where not completed and returned)                            as retained,
      count(*) filter (where not completed and student_type = 'Regular')            as reg_cohort,
      count(*) filter (where not completed and student_type = 'Regular' and returned)   as reg_retained,
      count(*) filter (where not completed and student_type = 'Irregular')          as irr_cohort,
      count(*) filter (where not completed and student_type = 'Irregular' and returned) as irr_retained
    from s
    group by from_order, course, year_level
    having count(*) filter (where not completed) > 0
  ),
  trans as (
    select
      from_order,
      min(from_sy) as from_sy, min(from_sem) as from_sem,
      min(to_sy) as to_sy, min(to_sem) as to_sem,
      bool_or(in_progress) as in_progress,
      count(*) filter (where completed) as completed
    from s
    group by from_order
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'order', t.from_order,
    'from', jsonb_build_object('school_year', t.from_sy, 'semester', t.from_sem),
    'to',   jsonb_build_object('school_year', t.to_sy,   'semester', t.to_sem),
    'inProgress', t.in_progress,
    'completed', t.completed,
    'byGroup', (
      select jsonb_agg(jsonb_build_object(
        'course', g.course, 'year_level', g.year_level,
        'cohort', g.cohort, 'retained', g.retained,
        'byType', jsonb_build_array(
          jsonb_build_object('type', 'Regular',   'cohort', g.reg_cohort, 'retained', g.reg_retained),
          jsonb_build_object('type', 'Irregular', 'cohort', g.irr_cohort, 'retained', g.irr_retained))
      ) order by g.course, g.year_level)
      from groups g where g.from_order = t.from_order
    )
  ) order by t.from_order desc), '[]'::jsonb)
  from trans t;
$function$
;

CREATE OR REPLACE FUNCTION public.school_origin_stats()
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with top as (
    select name, lead_count, enrolled_count
      from school_origin_v where source = 'feeder'
     order by lead_count desc, enrolled_count desc, first_lead_pos
     limit 1
  )
  select jsonb_build_object(
    'total_schools',   (select count(*) from school_origin_v),
    'origin_leads',    (select coalesce(sum(lead_count), 0) from school_origin_v),
    'total_leads',     (select count(*) from leads),
    'total_enrolled',  (select count(*) from leads l
                          where l.status = 'enrolled'
                             or exists (select 1 from enrollments e where e.lead_id = l.id)),
    'feeder_schools',  (select count(*) from school_origin_v where source = 'feeder'),
    'top_feeder',      (select jsonb_build_object(
                          'name', t.name, 'lead_count', t.lead_count, 'enrolled_count', t.enrolled_count,
                          'tied_with', (select count(*) from school_origin_v v
                                         where v.source = 'feeder' and v.name <> t.name
                                           and v.lead_count = t.lead_count
                                           and v.enrolled_count = t.enrolled_count))
                        from top t)
  );
$function$
;

CREATE OR REPLACE FUNCTION public.search_school_registry(query text, lim integer DEFAULT 8)
 RETURNS TABLE(source text, registry_id bigint, school_name text, level text, classification text, municipality text, region text, lat double precision, lng double precision, rank real)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select * from (
    select
      'deped'::text                                       as source,
      d.id                                                as registry_id,
      d.school_name,
      coalesce(d.level_label, d.level_code)               as level,
      'Public'::text                                      as classification,
      public.school_registry_area_city('deped', d.division) as municipality,
      d.region,
      d.lat,
      d.lng,
      ts_rank(d.search_vec, websearch_to_tsquery('simple', query)) as rank
    from public.deped_masterlist d
    where d.search_vec @@ websearch_to_tsquery('simple', query)
      and public.school_registry_area_city('deped', d.division) is not null

    union all

    select
      'ched'::text                                        as source,
      c.id                                                as registry_id,
      c.institution_name                                  as school_name,
      'College/University'::text                          as level,
      c.type                                              as classification,
      public.school_registry_area_city('ched', c.city_municipality) as municipality,
      c.region,
      null::double precision                              as lat,
      null::double precision                              as lng,
      ts_rank(c.search_vec, websearch_to_tsquery('simple', query)) as rank
    from public.ched_hei_list c
    where c.search_vec @@ websearch_to_tsquery('simple', query)
      and public.school_registry_area_city('ched', c.city_municipality) is not null
  ) r
  order by rank desc
  limit lim;
$function$
;

CREATE OR REPLACE FUNCTION public.session_heartbeat()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_uid       uuid := auth.uid();
  v_sid       uuid;
  v_created   timestamptz;
  v_active    public.user_active_sessions;
  v_active_ok boolean;
begin
  begin
    v_sid := nullif(auth.jwt() ->> 'session_id', '')::uuid;
  exception when others then
    v_sid := null;
  end;

  if v_uid is null or v_sid is null then
    return 'current';
  end if;

  select * into v_active from public.user_active_sessions where user_id = v_uid;

  if v_active.user_id is not null and v_active.session_id = v_sid then
    return 'current';
  end if;

  select s.created_at into v_created from auth.sessions s where s.id = v_sid and s.user_id = v_uid;

  if v_created is null then
    return case when v_active.user_id is null then 'current' else 'replaced' end;
  end if;

  v_active_ok := v_active.user_id is not null
    and exists (select 1 from auth.sessions s where s.id = v_active.session_id);

  if v_active_ok and v_active.session_created_at > v_created then
    return 'replaced';
  end if;

  insert into public.user_active_sessions (user_id, session_id, session_created_at, updated_at)
  values (v_uid, v_sid, v_created, now())
  on conflict (user_id) do update
    set session_id = excluded.session_id,
        session_created_at = excluded.session_created_at,
        updated_at = now();

  return case when v_active.user_id is null then 'current' else 'claimed' end;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.set_audit_log_actor()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.actor_id IS NULL THEN
    NEW.actor_id := auth.uid();
  END IF;
  IF NEW.actor_email IS NULL THEN
    SELECT email INTO NEW.actor_email
    FROM auth.users WHERE id = NEW.actor_id;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_scholar_batch_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_student_profiles_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at()
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

CREATE OR REPLACE FUNCTION public.sm_clean_id(v text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE
AS $function$
  select regexp_replace(lower(coalesce(v, '')), '[^a-z0-9]', '', 'g');
$function$
;

CREATE OR REPLACE FUNCTION public.sm_clean_text(v text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE
AS $function$
  select trim(regexp_replace(
           translate(lower(coalesce(v, '')), 'áàâäãåéèêëíìîïóòôöõúùûüñç', 'aaaaaaeeeeiiiiooooouuuunc'),
           '[^a-z0-9 ]', ' ', 'g'));
$function$
;

CREATE OR REPLACE FUNCTION public.sm_words_str(v text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE
AS $function$
  select trim(regexp_replace(' ' || regexp_replace(public.sm_clean_text(v), '\s+', ' ', 'g') || ' ',
                             ' (jr|sr|ii|iii|iv)(?= )', '', 'g'));
$function$
;

CREATE OR REPLACE FUNCTION public.sm_words(v text)
 RETURNS text[]
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE
AS $function$
  select coalesce(string_to_array(nullif(public.sm_words_str(v), ''), ' '), '{}');
$function$
;

CREATE OR REPLACE FUNCTION public.sm_key_parts(p_first text, p_last text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE
AS $function$
  select case
    when split_part(public.sm_words_str(p_first), ' ', 1) <> '' and public.sm_words_str(p_last) <> ''
      then split_part(public.sm_words_str(p_first), ' ', 1) || '|' || regexp_replace(public.sm_words_str(p_last), '^.* ', '')
    else '' end;
$function$
;

CREATE OR REPLACE FUNCTION public.sm_key_full(p_full text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE
AS $function$
  select case
    when strpos(coalesce(p_full, ''), ',') > 0
      then public.sm_key_parts(replace(substr(p_full, strpos(p_full, ',') + 1), ',', ' '), split_part(p_full, ',', 1))
    else (select case when cardinality(w) >= 2 then w[1] || '|' || w[cardinality(w)] else '' end
          from (select public.sm_words(p_full) w) x)
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.sm_key_surname_first(p_full text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE
AS $function$
  select case
    when strpos(coalesce(p_full, ''), ',') > 0 then ''
    else (select case when cardinality(w) >= 2 then w[2] || '|' || w[1] else '' end
          from (select public.sm_words(p_full) w) x)
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.standing_counts(p_category text DEFAULT 'not_graduating'::text, p_year text DEFAULT NULL::text, p_course text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with v as materialized (
    select category, course, codes, years from standing_students_v
  ),
  s as (
    select * from v
    where coalesce(p_year, '') = '' or p_year = any(years)
  )
  select jsonb_build_object(
    'not_graduating', (select count(*) from s where category = 'not_graduating'),
    'irregular',      (select count(*) from s where category = 'irregular'),
    'rules', coalesce((
      select jsonb_object_agg(code, n) from (
        select code, count(*) n
        from s, unnest(s.codes) as code
        where s.category = p_category and (coalesce(p_course, '') = '' or s.course = p_course)
        group by code
      ) t), '{}'::jsonb),
    'courses', coalesce((select jsonb_agg(distinct course order by course) from v where course is not null and course <> ''), '[]'::jsonb),
    'years',   coalesce((select jsonb_agg(y order by y desc) from (select distinct unnest(years) y from v) t), '[]'::jsonb)
  );
$function$
;
