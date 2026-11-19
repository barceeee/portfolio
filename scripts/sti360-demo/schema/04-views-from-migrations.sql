-- Views identical on the live project and in the repo migrations (md5-checked).
create or replace view public.leads_list_v as
 SELECT l.id,
    l.first_name,
    l.last_name,
    l.email,
    l.phone,
    l.status,
    l.source,
    l.created_at,
    l.school_id,
    COALESCE(s.name, NULLIF(btrim(l.school_name), ''::text)) AS school_name,
    s.type AS school_type,
    lower(concat_ws(' '::text, ((l.first_name || ' '::text) || l.last_name), l.suffix, COALESCE(s.name, NULLIF(btrim(l.school_name), ''::text)))) AS search_text,
    l.suffix
   FROM (leads l
     LEFT JOIN schools s ON ((s.id = l.school_id)));

create or replace view public.school_origin_v as
 WITH l AS (
         SELECT COALESCE(s.name, NULLIF(btrim(l_1.school_name), ''::text)) AS name,
            s.city,
            s.type,
            row_number() OVER (ORDER BY l_1.created_at DESC, l_1.id) AS lead_pos,
            ((l_1.status = 'enrolled'::text) OR (EXISTS ( SELECT 1
                   FROM enrollments e
                  WHERE (e.lead_id = l_1.id)))) AS enrolled
           FROM (leads l_1
             LEFT JOIN schools s ON ((s.id = l_1.school_id)))
          WHERE (COALESCE(s.name, NULLIF(btrim(l_1.school_name), ''::text)) IS NOT NULL)
        )
 SELECT lower(name) AS school_key,
    min(name) AS name,
    min(city) AS city,
        CASE
            WHEN bool_or((type = 'feeder'::text)) THEN 'feeder'::text
            WHEN bool_or((type = 'competition'::text)) THEN 'competition'::text
            WHEN bool_or((type IS NOT NULL)) THEN 'non-feeder'::text
            ELSE 'unlisted'::text
        END AS source,
    (count(*))::integer AS lead_count,
    (count(*) FILTER (WHERE enrolled))::integer AS enrolled_count,
    (min(lead_pos))::integer AS first_lead_pos
   FROM l
  GROUP BY (lower(name));

create or replace view public.qualified_leads_v as
 SELECT l.id,
    l.first_name,
    l.last_name,
    l.email,
    l.status,
    l.created_at,
    s.name AS school_name,
    lower(concat_ws(' '::text, l.first_name, l.last_name, l.email, s.name)) AS search_text
   FROM (leads l
     LEFT JOIN schools s ON ((s.id = l.school_id)))
  WHERE ((l.status = 'qualified'::text) AND (NOT (EXISTS ( SELECT 1
           FROM enrollments e
          WHERE (e.lead_id = l.id)))));

create or replace view public.student_standing_flags as
 WITH e AS (
         SELECT ((regexp_replace(lower(COALESCE(enrollments.last_name, ''::text)), '[^a-z0-9]'::text, ''::text, 'g'::text) || '|'::text) || regexp_replace(lower(COALESCE(enrollments.first_name, ''::text)), '[^a-z0-9]'::text, ''::text, 'g'::text)) AS sid,
            lower(NULLIF(TRIM(BOTH FROM enrollments.student_id), ''::text)) AS idk,
            enrollments.student_id,
            enrollments.first_name,
            enrollments.last_name,
            enrollments.course,
            enrollments.year_level,
            enrollments.section,
            enrollments.student_type,
            enrollments.school_year,
            enrollments.semester,
            ("left"(enrollments.year_level, 1))::integer AS yl,
            ("left"(enrollments.school_year, 4))::integer AS sy_start,
            ((("left"(enrollments.school_year, 4))::integer * 3) +
                CASE enrollments.semester
                    WHEN '2nd Semester'::text THEN 1
                    WHEN 'Summer'::text THEN 2
                    ELSE 0
                END) AS term_rank,
                CASE
                    WHEN (enrollments.semester = ANY (ARRAY['1st Semester'::text, '2nd Semester'::text])) THEN ((("left"(enrollments.school_year, 4))::integer * 2) +
                    CASE enrollments.semester
                        WHEN '2nd Semester'::text THEN 1
                        ELSE 0
                    END)
                    ELSE NULL::integer
                END AS reg_index
           FROM enrollments
          WHERE ((NULLIF(TRIM(BOTH FROM enrollments.last_name), ''::text) IS NOT NULL) AND (enrollments.year_level ~ '^[1-4]'::text) AND (enrollments.school_year ~ '^\d{4}-\d{4}$'::text))
        ), latest AS (
         SELECT DISTINCT ON (e.sid) e.sid,
            e.idk,
            e.student_id,
            e.first_name,
            e.last_name,
            e.course,
            e.year_level,
            e.section,
            e.student_type,
            e.school_year,
            e.semester,
            e.yl,
            e.sy_start,
            e.term_rank,
            e.reg_index
           FROM e
          ORDER BY e.sid, e.term_rank DESC
        ), id_map AS (
         SELECT DISTINCT ON (e.idk) e.idk,
            e.sid
           FROM e
          WHERE (e.idk IS NOT NULL)
          ORDER BY e.idk, e.sid
        ), g0 AS (
         SELECT ((regexp_replace(lower(COALESCE(graduating_students.last_name, ''::text)), '[^a-z0-9]'::text, ''::text, 'g'::text) || '|'::text) || regexp_replace(lower(COALESCE(graduating_students.first_name, ''::text)), '[^a-z0-9]'::text, ''::text, 'g'::text)) AS name_key,
            lower(NULLIF(TRIM(BOTH FROM graduating_students.student_id), ''::text)) AS idk,
            graduating_students.student_id,
            graduating_students.first_name,
            graduating_students.last_name,
            graduating_students.course,
            graduating_students.school_year,
            graduating_students.status,
            graduating_students.graduation_date,
            ("left"(graduating_students.school_year, 4))::integer AS sy_start
           FROM graduating_students
          WHERE ((graduating_students.school_year ~ '^\d{4}-\d{4}$'::text) AND (COALESCE(graduating_students.education_level, 'college'::text) = 'college'::text))
        ), g AS (
         SELECT g0.name_key,
            g0.idk,
            g0.student_id,
            g0.first_name,
            g0.last_name,
            g0.course,
            g0.school_year,
            g0.status,
            g0.graduation_date,
            g0.sy_start,
            COALESCE(m.sid, g0.name_key) AS sid
           FROM (g0
             LEFT JOIN id_map m ON ((m.idk = g0.idk)))
        ), g_listed AS (
         SELECT DISTINCT g.sid,
            g.school_year
           FROM g
        ), g_years AS (
         SELECT DISTINCT g.school_year
           FROM g
        ), g_latest AS (
         SELECT DISTINCT ON (g.sid) g.name_key,
            g.idk,
            g.student_id,
            g.first_name,
            g.last_name,
            g.course,
            g.school_year,
            g.status,
            g.graduation_date,
            g.sy_start,
            g.sid
           FROM g
          ORDER BY g.sid, g.sy_start DESC
        ), seq AS (
         SELECT e.sid,
            e.school_year,
            e.semester,
            e.year_level,
            e.yl,
            e.course,
            e.reg_index,
            lag(e.yl) OVER w AS prev_yl,
            lag(e.year_level) OVER w AS prev_level,
            lag(e.course) OVER w AS prev_course,
            lag(e.reg_index) OVER w AS prev_reg,
            lag(e.school_year) OVER w AS prev_sy,
            lag(e.semester) OVER w AS prev_sem
           FROM e
          WINDOW w AS (PARTITION BY e.sid ORDER BY e.term_rank)
        ), repeated AS (
         SELECT e.sid,
            e.year_level,
            max(e.yl) AS yl,
            count(DISTINCT e.term_rank) AS n,
            string_agg(DISTINCT e.school_year, ', '::text ORDER BY e.school_year) AS years,
            max(e.school_year) AS last_year
           FROM e
          GROUP BY e.sid, e.year_level
         HAVING (count(DISTINCT e.term_rank) > 2)
        ), flags AS (
         SELECT e.sid,
            'irregular'::text AS category,
            'marked_irregular'::text AS code,
            ((('Marked Irregular in the '::text || string_agg(((e.school_year || ' '::text) || COALESCE(e.semester, ''::text)), ', '::text ORDER BY e.term_rank)) || ' enrollment upload'::text) ||
                CASE
                    WHEN (count(*) > 1) THEN 's'::text
                    ELSE ''::text
                END) AS reason,
            e.school_year AS flag_school_year
           FROM e
          WHERE (e.student_type = 'Irregular'::text)
          GROUP BY e.sid, e.school_year
        UNION ALL
         SELECT r.sid,
            'irregular'::text,
            'repeated_year_level'::text,
            (((((r.year_level || ' for '::text) || r.n) || ' semesters ('::text) || r.years) || '); a regular student takes 2'::text),
            r.last_year
           FROM repeated r
        UNION ALL
         SELECT s.sid,
            'irregular'::text,
            'year_level_dropped'::text,
            ((((((('Year level went from '::text || s.prev_level) || ' to '::text) || s.year_level) || ' in '::text) || s.school_year) || ' '::text) || COALESCE(s.semester, ''::text)),
            s.school_year
           FROM seq s
          WHERE ((s.prev_yl IS NOT NULL) AND (s.yl < s.prev_yl) AND (NOT (s.course IS DISTINCT FROM s.prev_course)))
        UNION ALL
         SELECT s.sid,
            'irregular'::text,
            'shifted_program'::text,
            ((((((('Shifted from '::text || s.prev_course) || ' to '::text) || s.course) || ' in '::text) || s.school_year) || ' '::text) || COALESCE(s.semester, ''::text)),
            s.school_year
           FROM seq s
          WHERE ((s.prev_course IS NOT NULL) AND (s.course IS DISTINCT FROM s.prev_course))
        UNION ALL
         SELECT s.sid,
            'irregular'::text,
            'returned_after_gap'::text,
            ((((((((((('Not enrolled for '::text || ((s.reg_index - s.prev_reg) - 1)) || ' semester'::text) ||
                CASE
                    WHEN (((s.reg_index - s.prev_reg) - 1) = 1) THEN ''::text
                    ELSE 's'::text
                END) || ' after '::text) || s.prev_sy) || ' '::text) || s.prev_sem) || '; returned in '::text) || s.school_year) || ' '::text) || s.semester),
            s.school_year
           FROM seq s
          WHERE ((s.prev_reg IS NOT NULL) AND (s.reg_index IS NOT NULL) AND ((s.reg_index - s.prev_reg) > 1))
        UNION ALL
         SELECT DISTINCT e.sid,
            'not_graduating'::text,
            'not_on_graduating_list'::text,
            (((('4th Year in '::text || e.school_year) || ' but not on the '::text) || e.school_year) || ' graduating list'::text),
            e.school_year
           FROM ((e
             JOIN g_years gy ON ((gy.school_year = e.school_year)))
             LEFT JOIN g_listed gl_1 ON (((gl_1.sid = e.sid) AND (gl_1.school_year = e.school_year))))
          WHERE ((e.yl = 4) AND (gl_1.sid IS NULL))
        UNION ALL
         SELECT g.sid,
            'not_graduating'::text,
            'graduation_date_passed'::text,
            ((('Graduation date ('::text || to_char((g.graduation_date)::timestamp with time zone, 'Mon DD, YYYY'::text)) || ') has passed but status is still '::text) || g.status),
            g.school_year
           FROM g
          WHERE ((g.status = ANY (ARRAY['pending'::text, 'confirmed'::text])) AND (g.graduation_date < CURRENT_DATE))
        UNION ALL
         SELECT r.sid,
            'not_graduating'::text,
            'repeated_fourth_year'::text,
            (((('4th Year for '::text || r.n) || ' semesters ('::text) || r.years) || '); a regular student takes 2'::text),
            r.last_year
           FROM repeated r
          WHERE (r.yl = 4)
        )
 SELECT f.sid AS student_key,
    COALESCE(l.student_id, gl.student_id) AS student_id,
    COALESCE(l.first_name, gl.first_name) AS first_name,
    COALESCE(l.last_name, gl.last_name) AS last_name,
    COALESCE(l.course, gl.course) AS course,
    l.year_level,
    l.section,
    l.student_type,
    l.school_year AS latest_school_year,
    l.semester AS latest_semester,
    f.category,
    f.code,
    f.reason,
    f.flag_school_year
   FROM ((flags f
     LEFT JOIN latest l ON ((l.sid = f.sid)))
     LEFT JOIN g_latest gl ON ((gl.sid = f.sid)));

create or replace view public.form138_students_v as
 WITH e AS (
         SELECT en.id,
            en.full_name,
            en.first_name,
            en.last_name,
            en.student_id,
            en.course,
            en.year_level,
            en.grade_level,
            COALESCE((en.enrollment_date)::timestamp with time zone, en.created_at) AS sort_date,
                CASE
                    WHEN (NULLIF(TRIM(BOTH FROM en.student_id), ''::text) IS NOT NULL) THEN ('id:'::text || regexp_replace(lower(en.student_id), '[^a-z0-9]'::text, ''::text, 'g'::text))
                    ELSE ((('nm:'::text || regexp_replace(lower(COALESCE(en.last_name, ''::text)), '[^a-z0-9]'::text, ''::text, 'g'::text)) || '|'::text) || regexp_replace(lower(COALESCE(en.first_name, ''::text)), '[^a-z0-9]'::text, ''::text, 'g'::text))
                END AS student_key,
            (f.status)::text AS f_status,
            f.received_at,
            f.updated_at,
            f.file_name,
            f.storage_path,
            f.file_url,
            f.extraction_status,
            f.extracted_gwa,
            f.extracted_math_grade,
            f.extracted_english_grade
           FROM (enrollments en
             LEFT JOIN LATERAL ( SELECT r.id,
                    r.enrollment_id,
                    r.document_name,
                    r.is_required,
                    r.status,
                    r.received_at,
                    r.notes,
                    r.created_at,
                    r.updated_at,
                    r.file_url,
                    r.file_name,
                    r.file_size,
                    r.file_type,
                    r.extracted_gwa,
                    r.extracted_math_grade,
                    r.extracted_english_grade,
                    r.extracted_grades_json,
                    r.extraction_status,
                    r.extraction_notes,
                    r.shs_english_grade,
                    r.shs_math_grade,
                    r.shs_gwa,
                    r.storage_path,
                    r.extracted_at,
                    r.extraction_model
                   FROM enrollment_requirements r
                  WHERE ((r.enrollment_id = en.id) AND (r.document_name = 'Form 138 (Report Card)'::text))
                  ORDER BY r.created_at DESC
                 LIMIT 1) f ON (true))
        ), ranked AS (
         SELECT e.id,
            e.full_name,
            e.first_name,
            e.last_name,
            e.student_id,
            e.course,
            e.year_level,
            e.grade_level,
            e.sort_date,
            e.student_key,
            e.f_status,
            e.received_at,
            e.updated_at,
            e.file_name,
            e.storage_path,
            e.file_url,
            e.extraction_status,
            e.extracted_gwa,
            e.extracted_math_grade,
            e.extracted_english_grade,
            row_number() OVER (PARTITION BY e.student_key ORDER BY (e.f_status = 'received'::text) DESC NULLS LAST, e.sort_date DESC NULLS LAST, e.id) AS rn
           FROM e
        )
 SELECT id,
    student_id,
    course,
    year_level,
    grade_level,
    COALESCE(NULLIF(concat_ws(', '::text, NULLIF(last_name, ''::text), NULLIF(first_name, ''::text)), ''::text), NULLIF(full_name, ''::text), 'Unnamed'::text) AS name,
        CASE
            WHEN (f_status IS DISTINCT FROM 'received'::text) THEN 'missing'::text
            WHEN (extraction_status = 'verified'::text) THEN 'verified'::text
            WHEN (extraction_status = 'needs_review'::text) THEN 'review'::text
            WHEN (extraction_status = 'extracted'::text) THEN 'scanned'::text
            ELSE 'received'::text
        END AS status_key,
    f_status AS form138_status,
    received_at,
    updated_at,
    file_name,
    storage_path,
    file_url,
    extracted_gwa,
    extracted_math_grade,
    extracted_english_grade,
    COALESCE(received_at, updated_at) AS uploaded_at
   FROM ranked
  WHERE (rn = 1);

create or replace view public.enrollment_classification as
 WITH irregular AS (
         SELECT DISTINCT student_standing_flags.student_key
           FROM student_standing_flags
          WHERE (student_standing_flags.category = 'irregular'::text)
        )
 SELECT en.id AS enrollment_id,
    'Irregular'::text AS classification
   FROM (enrollments en
     JOIN irregular k ON ((k.student_key = ((regexp_replace(lower(COALESCE(en.last_name, ''::text)), '[^a-z0-9]'::text, ''::text, 'g'::text) || '|'::text) || regexp_replace(lower(COALESCE(en.first_name, ''::text)), '[^a-z0-9]'::text, ''::text, 'g'::text)))))
  WHERE ((NULLIF(TRIM(BOTH FROM en.last_name), ''::text) IS NOT NULL) AND (en.year_level ~ '^[1-4]'::text) AND (en.school_year ~ '^\d{4}-\d{4}$'::text) AND (en.student_type IS DISTINCT FROM 'Irregular'::text));

create or replace view public.standing_students_v as
 WITH f AS (
         SELECT student_standing_flags.student_key,
            student_standing_flags.student_id,
            student_standing_flags.first_name,
            student_standing_flags.last_name,
            student_standing_flags.course,
            student_standing_flags.year_level,
            student_standing_flags.section,
            student_standing_flags.student_type,
            student_standing_flags.latest_school_year,
            student_standing_flags.latest_semester,
            student_standing_flags.category,
            student_standing_flags.code,
            student_standing_flags.reason,
            student_standing_flags.flag_school_year
           FROM student_standing_flags
        ), irregular AS (
         SELECT DISTINCT f_1.student_key
           FROM f f_1
          WHERE (f_1.category = 'irregular'::text)
        )
 SELECT f.category,
    f.student_key,
    min(f.student_id) AS student_id,
    min(f.first_name) AS first_name,
    min(f.last_name) AS last_name,
    min(f.course) AS course,
    min(f.year_level) AS year_level,
    min(f.section) AS section,
    min(f.latest_school_year) AS latest_school_year,
    min(f.latest_semester) AS latest_semester,
    jsonb_agg(jsonb_build_object('code', f.code, 'text', f.reason) ORDER BY f.code, f.flag_school_year) AS reasons,
    array_agg(DISTINCT f.code) AS codes,
    COALESCE(array_agg(DISTINCT f.flag_school_year) FILTER (WHERE (f.flag_school_year IS NOT NULL)), '{}'::text[]) AS years,
        CASE
            WHEN bool_or((i.student_key IS NOT NULL)) THEN 'Irregular'::text
            ELSE 'Regular'::text
        END AS classification,
    TRIM(BOTH FROM ((COALESCE(min(f.last_name), ''::text) || ' '::text) || COALESCE(min(f.first_name), ''::text))) AS full_name,
        CASE min(f.year_level)
            WHEN '1st Year'::text THEN 1
            WHEN '2nd Year'::text THEN 2
            WHEN '3rd Year'::text THEN 3
            WHEN '4th Year'::text THEN 4
            ELSE 9
        END AS level_order,
    COALESCE(max(f.flag_school_year), ''::text) AS latest_year,
    ((COALESCE(min(f.latest_school_year), ''::text) || ' '::text) ||
        CASE min(f.latest_semester)
            WHEN '1st Semester'::text THEN '0'::text
            WHEN '2nd Semester'::text THEN '1'::text
            WHEN 'Summer'::text THEN '2'::text
            ELSE '9'::text
        END) AS term_sort,
    lower(concat_ws(' '::text, min(f.first_name), min(f.last_name), min(f.student_id))) AS search_text
   FROM (f
     LEFT JOIN irregular i ON ((i.student_key = f.student_key)))
  GROUP BY f.category, f.student_key;

create or replace view public.fari_submissions_program_v as
 SELECT s.id,
    s.temp_account_id,
    s.student_name,
    s.student_lrn,
    s.raw_reading_verbal,
    s.raw_numerical,
    s.raw_abstract,
    s.raw_digital_literacy,
    s.raw_psychometric_sum,
    s.item_answers,
    s.wss,
    s.zone,
    s.submitted_at,
    s.created_at,
    s.status,
    s.reviewed_at,
    s.section_max,
    s.reviewed_by,
    s.reviewed_by_email,
    s.counseling_case_key,
    e.course AS program,
    fit.fit_level AS program_fit_level,
        CASE
            WHEN (e.course IS NULL) THEN NULL::text
            WHEN (fit.fit_level = ANY (ARRAY['strong'::text, 'moderate'::text])) THEN 'aligned'::text
            WHEN (fit.fit_level = ANY (ARRAY['exploratory'::text, 'needs_support'::text])) THEN 'not_aligned'::text
            ELSE 'not_analyzed'::text
        END AS program_alignment
   FROM ((((fari_submissions s
     LEFT JOIN temp_exam_accounts t ON ((t.id = s.temp_account_id)))
     LEFT JOIN enrollments e ON ((e.id = t.enrollment_id)))
     LEFT JOIN fari_ai_analyses a ON ((a.submission_id = s.id)))
     LEFT JOIN LATERAL ( SELECT lower((f.value ->> 'fit_level'::text)) AS fit_level
           FROM jsonb_array_elements(COALESCE((a.analysis -> 'program_fit'::text), '[]'::jsonb)) f(value)
          WHERE ((e.course IS NOT NULL) AND ((f.value ->> 'program'::text) ~~* (('%('::text || e.course) || ')%'::text)))
         LIMIT 1) fit ON (true));

create or replace view public.school_lead_counts_v as
 SELECT s.id,
    s.name,
    s.city,
    s.type,
    (count(l.id))::integer AS lead_count,
    (count(l.id) FILTER (WHERE ((l.status = 'enrolled'::text) OR (EXISTS ( SELECT 1
           FROM enrollments e
          WHERE (e.lead_id = l.id))))))::integer AS enrolled_count
   FROM (schools s
     LEFT JOIN leads l ON ((l.school_id = s.id)))
  GROUP BY s.id;

create or replace view public.temp_accounts_v as
 WITH a AS (
         SELECT t.id,
            t.student_name,
            t.student_lrn,
            t.email,
            t.password,
            t.source,
            t.source_id,
            t.is_used,
            t.expires_at,
            t.created_at,
            t.created_by,
            t.opened_at,
            t.archived_at,
            t.session_token,
            t.session_expires_at,
            t.failed_attempts,
            t.locked_until,
            t.first_name,
            t.last_name,
            t.phone,
            t.enrollment_id,
            t.linked_by,
            (t.is_used OR (EXISTS ( SELECT 1
                   FROM fari_submissions f
                  WHERE (f.temp_account_id = t.id)))) AS used_effective
           FROM temp_exam_accounts t
        )
 SELECT id,
    student_name,
    first_name,
    last_name,
    phone,
    email,
    password,
    student_lrn,
    source,
    source_id,
    enrollment_id,
    linked_by,
    opened_at,
    archived_at,
    created_at,
    expires_at,
    used_effective,
    ((archived_at IS NULL) AND (NOT used_effective) AND (expires_at IS NOT NULL) AND (expires_at < now())) AS expired,
        CASE
            WHEN (archived_at IS NOT NULL) THEN 'archived'::text
            WHEN used_effective THEN 'used'::text
            WHEN ((expires_at IS NOT NULL) AND (expires_at < now())) THEN 'expired'::text
            ELSE 'active'::text
        END AS status
   FROM a;

create or replace view public.scholar_batch_v as
 SELECT sb.id,
    sb.email,
    sb.student_name,
    sb.scholarship_type,
    sb.scholarship_name,
    sb.scholar_status,
    sb.school_year,
    sb.semester,
    sb.notes,
    sb.created_at,
    sb.updated_at,
    sb.user_id,
    COALESCE(NULLIF(sb.student_name, ''::text), en.full_name, ld.lead_name) AS display_name,
    lower(concat_ws(' '::text, sb.email, sb.student_name, sb.scholarship_name, ld.lead_name, en.full_name)) AS search_text
   FROM ((scholar_batch sb
     LEFT JOIN LATERAL ( SELECT NULLIF(e.full_name, ''::text) AS full_name
           FROM enrollments e
          WHERE (e.email = sb.email)
          ORDER BY e.created_at DESC NULLS LAST, e.id
         LIMIT 1) en ON (true))
     LEFT JOIN LATERAL ( SELECT NULLIF(TRIM(BOTH FROM ((COALESCE(l.first_name, ''::text) || ' '::text) || COALESCE(l.last_name, ''::text))), ''::text) AS lead_name
           FROM leads l
          WHERE (l.email = sb.email)
          ORDER BY l.created_at DESC NULLS LAST, l.id
         LIMIT 1) ld ON (true));

create or replace view public.enrollment_list_v as
 WITH base AS (
         SELECT e.id,
            e.lead_id,
            e.student_id,
            e.enrollment_date,
            e.phone,
            e.section,
            COALESCE(e.is_walk_in, false) AS is_walk_in,
            e.course,
            e.year_level,
            e.school_year,
            e.semester,
            COALESCE(NULLIF(TRIM(BOTH FROM e.full_name), ''::text),
                CASE
                    WHEN (NULLIF(e.first_name, ''::text) IS NOT NULL) THEN TRIM(BOTH FROM ((e.first_name || ' '::text) || COALESCE(e.last_name, ''::text)))
                    ELSE NULL::text
                END, NULLIF(TRIM(BOTH FROM ((COALESCE(l.first_name, ''::text) || ' '::text) || COALESCE(l.last_name, ''::text))), ''::text), 'Walk-in Student'::text) AS name,
            COALESCE(NULLIF(e.email, ''::text), NULLIF(l.email, ''::text)) AS email,
            COALESCE(s.name, e.school_name, ls.name, NULLIF(btrim(l.school_name), ''::text)) AS school_name,
            COALESCE(ec.classification,
                CASE
                    WHEN (e.student_type = 'Irregular'::text) THEN 'Irregular'::text
                    ELSE 'Regular'::text
                END) AS classification
           FROM ((((enrollments e
             LEFT JOIN leads l ON ((l.id = e.lead_id)))
             LEFT JOIN schools s ON ((s.id = e.school_id)))
             LEFT JOIN schools ls ON ((ls.id = l.school_id)))
             LEFT JOIN enrollment_classification ec ON ((ec.enrollment_id = e.id)))
        )
 SELECT id,
    lead_id,
    student_id,
    enrollment_date,
    phone,
    section,
    is_walk_in,
    course,
    year_level,
    school_year,
    semester,
    name,
    email,
    school_name,
    classification,
    lower(concat_ws(' '::text, name, email, school_name, course, student_id)) AS search_text
   FROM base;

create or replace view public.document_students_v as
 WITH e AS (
         SELECT en.id,
            en.course,
            en.grade_level,
            en.education_level,
            COALESCE((en.enrollment_date)::timestamp with time zone, en.created_at) AS sort_date,
            COALESCE(NULLIF(en.full_name, ''::text),
                CASE
                    WHEN (l.id IS NOT NULL) THEN COALESCE(NULLIF(TRIM(BOTH FROM ((COALESCE(l.first_name, ''::text) || ' '::text) || COALESCE(l.last_name, ''::text))), ''::text), 'Unknown'::text)
                    ELSE NULL::text
                END, 'Walk-in Student'::text) AS student_name,
                CASE
                    WHEN (NULLIF(TRIM(BOTH FROM en.student_id), ''::text) IS NOT NULL) THEN ('id:'::text || regexp_replace(lower(en.student_id), '[^a-z0-9]'::text, ''::text, 'g'::text))
                    ELSE ((('nm:'::text || regexp_replace(lower(COALESCE(en.last_name, ''::text)), '[^a-z0-9]'::text, ''::text, 'g'::text)) || '|'::text) || regexp_replace(lower(COALESCE(en.first_name, ''::text)), '[^a-z0-9]'::text, ''::text, 'g'::text))
                END AS student_key,
            (f.status)::text AS form138_status,
            f.extraction_status AS form138_extraction_status,
            f.extracted_gwa AS form138_gwa,
            en.year_level,
            en.school_year
           FROM ((enrollments en
             LEFT JOIN leads l ON ((l.id = en.lead_id)))
             LEFT JOIN LATERAL ( SELECT r.status,
                    r.extraction_status,
                    r.extracted_gwa
                   FROM enrollment_requirements r
                  WHERE ((r.enrollment_id = en.id) AND (r.document_name = 'Form 138 (Report Card)'::text))
                  ORDER BY r.created_at
                 LIMIT 1) f ON (true))
        ), ranked AS (
         SELECT e.id,
            e.course,
            e.grade_level,
            e.education_level,
            e.sort_date,
            e.student_name,
            e.student_key,
            e.form138_status,
            e.form138_extraction_status,
            e.form138_gwa,
            e.year_level,
            e.school_year,
            row_number() OVER (PARTITION BY e.student_key ORDER BY (e.form138_status = 'received'::text) DESC NULLS LAST, e.sort_date DESC NULLS LAST, e.id) AS rn,
            max(e.sort_date) OVER (PARTITION BY e.student_key) AS latest_date
           FROM e
        )
 SELECT id,
    student_name,
    course,
    grade_level,
    education_level,
    form138_status,
    form138_extraction_status,
    form138_gwa,
    latest_date,
    lower(concat_ws(' '::text, student_name, course, grade_level)) AS search_text,
    year_level,
    school_year
   FROM ranked
  WHERE (rn = 1);
