-- Functions read from the live catalog (pg_get_functiondef), part D.
CREATE OR REPLACE FUNCTION public.fari_compute_wss(p_reading integer, p_numerical integer, p_abstract integer, p_digital integer, p_psychometric integer, p_max jsonb)
 RETURNS TABLE(wss numeric, zone text)
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO ''
AS $function$
  WITH m AS (
    SELECT
      greatest(coalesce((p_max->>'reading_verbal')::int,   25), 1) AS r,
      greatest(coalesce((p_max->>'numerical')::int,        20), 1) AS n,
      greatest(coalesce((p_max->>'abstract')::int,         15), 1) AS a,
      greatest(coalesce((p_max->>'digital_literacy')::int, 15), 1) AS d,
      greatest(coalesce((p_max->>'psychometric')::int,     30), 1) AS p
  ), s AS (
    SELECT
      least(greatest(coalesce(p_reading,   0), 0), m.r)
      + least(greatest(coalesce(p_numerical, 0), 0), m.n)
      + least(greatest(coalesce(p_abstract,  0), 0), m.a) AS academic,
      (m.r + m.n + m.a)                                   AS academic_max,
      least(greatest(coalesce(p_digital, 0), 0), m.d)     AS digital,
      m.d                                                 AS digital_max,
      p_psychometric                                      AS psy,
      m.p                                                 AS psy_items
    FROM m
  ), t AS (
    SELECT CASE WHEN psy BETWEEN psy_items AND 5 * psy_items THEN round(
        academic::numeric / academic_max * 50
      + digital::numeric  / digital_max  * 20
      + (psy - psy_items)::numeric / (4 * psy_items) * 30, 2)
    END AS wss
    FROM s
  )
  SELECT wss,
         CASE WHEN wss IS NULL THEN NULL
              WHEN wss >= 80 THEN 'green'
              WHEN wss >= 50 THEN 'yellow'
              ELSE 'red' END
  FROM t;
$function$
;

CREATE OR REPLACE FUNCTION public.fari_compute_wss(p_reading integer, p_numerical integer, p_abstract integer, p_digital integer, p_psychometric integer)
 RETURNS TABLE(wss numeric, zone text)
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO ''
AS $function$
  SELECT * FROM public.fari_compute_wss(p_reading, p_numerical, p_abstract, p_digital, p_psychometric, NULL::jsonb);
$function$
;

CREATE OR REPLACE FUNCTION public.fari_flag_labels(s fari_submissions, p_grit_ids text[], p_course text)
 RETURNS text[]
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
declare
  m_num int := 20; m_dl int := 15; m_psy int := 30;
  numerical numeric; digital numeric; psych_sum numeric; psych_avg numeric;
  keys text[]; total int := 0; v text; grit numeric; dropout numeric;
  is_bsit boolean; labels text[] := '{}';
begin
  if s.section_max is not null and jsonb_typeof(s.section_max) = 'object' then
    if (s.section_max->>'numerical') ~ '^\d+$' and (s.section_max->>'numerical')::int >= 1 then m_num := (s.section_max->>'numerical')::int; end if;
    if (s.section_max->>'digital_literacy') ~ '^\d+$' and (s.section_max->>'digital_literacy')::int >= 1 then m_dl := (s.section_max->>'digital_literacy')::int; end if;
    if (s.section_max->>'psychometric') ~ '^\d+$' and (s.section_max->>'psychometric')::int >= 1 then m_psy := (s.section_max->>'psychometric')::int; end if;
  end if;
  numerical := least(greatest(coalesce(s.raw_numerical, 0), 0), m_num);
  digital   := least(greatest(coalesce(s.raw_digital_literacy, 0), 0), m_dl);
  psych_sum := greatest(coalesce(s.raw_psychometric_sum, 0), 0);
  psych_avg := case when psych_sum >= m_psy and psych_sum <= 5 * m_psy then round(psych_sum / m_psy, 2) end;

  if digital < round(8.0 / 15 * m_dl, 2) then labels := array_append(labels, 'LMS orientation required'); end if;

  if s.item_answers is not null and jsonb_typeof(s.item_answers) = 'object' then
    keys := case when cardinality(p_grit_ids) = 10 and exists (select 1 from unnest(p_grit_ids) k where s.item_answers ? k)
                 then p_grit_ids else array['76','77','78','79','80','81','82','83','84','85'] end;
    grit := null;
    foreach v in array keys loop
      if coalesce(s.item_answers->>v, '') !~ '^\s*[1-5](\.0+)?\s*$' then total := null; exit; end if;
      total := total + (s.item_answers->>v)::numeric::int;
    end loop;
    if total is not null then grit := round(total::numeric / 10, 2); end if;
  end if;
  dropout := coalesce(grit, psych_avg);
  if dropout is not null and dropout < 2.5 then labels := array_append(labels, 'Attrition-risk counseling'); end if;

  is_bsit := upper(coalesce(p_course, '')) like '%BSIT%';
  if numerical < round(10.0 / 20 * m_num, 2) and (is_bsit or coalesce(p_course, '') = '') then
    labels := array_append(labels, case when is_bsit then 'Math tutorial required' else 'Math tutorial if BSIT' end);
  end if;
  return labels;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.fari_question_counts()
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_object_agg(section_key, n), '{}'::jsonb)
  from (select section_key, count(*) n from fari_questions group by section_key) t;
$function$
;

CREATE OR REPLACE FUNCTION public.fari_renumber_questions()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid() AND u.role IN ('admin', 'guidance') AND u.is_active
  ) THEN
    RAISE EXCEPTION 'Only Admin or Guidance can renumber questions';
  END IF;

  SET CONSTRAINTS public.fari_questions_item_number_key DEFERRED;
  -- Renumbering is bookkeeping, not a user edit: don't flood the audit log.
  PERFORM set_config('sti.skip_audit', 'on', true);

  WITH o AS (
    SELECT id, row_number() OVER (
      ORDER BY CASE section_key
                 WHEN 'reading_verbal'   THEN 1
                 WHEN 'numerical'        THEN 2
                 WHEN 'abstract'         THEN 3
                 WHEN 'digital_literacy' THEN 4
                 WHEN 'psychometric'     THEN 5
                 ELSE 6 END,
               item_number, created_at
    ) AS rn
    FROM public.fari_questions
  )
  UPDATE public.fari_questions q
  SET item_number = o.rn
  FROM o
  WHERE q.id = o.id AND q.item_number IS DISTINCT FROM o.rn;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fari_review_stamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'finalized' THEN
      NEW.reviewed_at       := now();
      NEW.reviewed_by       := auth.uid();
      NEW.reviewed_by_email := (SELECT u.email FROM auth.users u WHERE u.id = auth.uid());
    ELSE
      NEW.reviewed_at       := NULL;
      NEW.reviewed_by       := NULL;
      NEW.reviewed_by_email := NULL;
    END IF;
  ELSE
    -- Reviewer fields can only change together with the status.
    NEW.reviewed_at       := OLD.reviewed_at;
    NEW.reviewed_by       := OLD.reviewed_by;
    NEW.reviewed_by_email := OLD.reviewed_by_email;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fari_section_counts()
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT jsonb_build_object(
    'reading_verbal',   count(*) FILTER (WHERE section_key = 'reading_verbal'),
    'numerical',        count(*) FILTER (WHERE section_key = 'numerical'),
    'abstract',         count(*) FILTER (WHERE section_key = 'abstract'),
    'digital_literacy', count(*) FILTER (WHERE section_key = 'digital_literacy'),
    'psychometric',     count(*) FILTER (WHERE section_key = 'psychometric')
  )
  FROM public.fari_questions;
$function$
;

CREATE OR REPLACE FUNCTION public.fari_set_wss()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE r record;
BEGIN
  IF NEW.section_max IS NULL THEN
    NEW.section_max := public.fari_section_counts();
  END IF;
  SELECT * INTO r FROM public.fari_compute_wss(
    NEW.raw_reading_verbal, NEW.raw_numerical, NEW.raw_abstract,
    NEW.raw_digital_literacy, NEW.raw_psychometric_sum, NEW.section_max);
  NEW.wss  := r.wss;
  NEW.zone := r.zone;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.form138_status_counts()
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_object_agg(status_key, n), '{}'::jsonb)
         || jsonb_build_object(
              'uploaded', coalesce(sum(n) filter (where status_key <> 'missing'), 0),
              'all',      coalesce(sum(n), 0))
  from (select status_key, count(*) n from form138_students_v group by status_key) t;
$function$
;

CREATE OR REPLACE FUNCTION public.get_my_authorized_account()
 RETURNS TABLE(email text, first_name text, last_name text, role text, is_active boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
#variable_conflict use_column
declare
  v_email   text := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  v_user_id uuid := auth.uid();
  v_name    text;
begin
  if v_email = '' then
    return;
  end if;

  if public.is_sti_student_email(v_email)
     and not exists (select 1 from public.authorized_accounts a where a.email = v_email) then
    v_name := coalesce(
      nullif(trim(auth.jwt() -> 'user_metadata' ->> 'full_name'), ''),
      nullif(trim(auth.jwt() -> 'user_metadata' ->> 'name'), ''),
      v_email
    );

    insert into public.authorized_accounts (email, first_name, last_name, role, is_active)
    values (v_email, v_name, null, 'student', true)
    on conflict (email) do nothing;
  end if;

  if v_user_id is not null then
    begin
      perform public.sync_user_from_authorized_account(v_email);
    exception when others then
      null;
    end;
  end if;

  return query
  select a.email, a.first_name, a.last_name, a.role, a.is_active
  from public.authorized_accounts a
  where a.email = v_email;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_my_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role
  FROM public.users
  WHERE id = auth.uid()
     OR email = lower(auth.jwt() ->> 'email')
  LIMIT 1;
$function$
;

CREATE OR REPLACE FUNCTION public.graduating_students_fill_school_origin()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_student text := new.student_id;
  v_enrollment uuid;
  o record;
begin
  if nullif(btrim(new.school_origin), '') is not null then
    return new;
  end if;

  if new.enrollment_id is not null then
    select * into o from public.enrollment_school_origin(new.enrollment_id);
    if found then
      new.school_origin      := o.school_origin;
      new.school_origin_type := o.school_origin_type;
      return new;
    end if;
    if v_student is null then
      select e.student_id into v_student from public.enrollments e where e.id = new.enrollment_id;
    end if;
  end if;

  if v_student is not null then
    select e.id into v_enrollment
    from public.enrollments e
    where e.student_id = v_student
      and e.school_name is not null
    order by e.created_at desc
    limit 1;
    if v_enrollment is not null then
      select * into o from public.enrollment_school_origin(v_enrollment);
      if found then
        new.school_origin      := o.school_origin;
        new.school_origin_type := o.school_origin_type;
      end if;
    end if;
  end if;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.is_sti_student_email(p_email text)
 RETURNS boolean
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO ''
AS $function$
  select coalesce(lower(trim(p_email)) ~ '@([a-z0-9-]+\.)?sti\.edu\.ph$', false);
$function$
;
