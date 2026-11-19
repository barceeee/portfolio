-- Views read from the live catalog (pg_get_viewdef) that differ from the repo migrations.
create or replace view public.employment_surveys_v as
 SELECT id,
    student_id,
    first_name,
    last_name,
    email,
    course,
    graduation_year,
    school_year,
    employment_status,
    company_name,
    job_title,
    industry,
    monthly_salary,
    months_to_employment,
    unemployment_reason,
    is_aligned_to_course,
    survey_date,
    remarks,
    enrollment_id,
    created_at,
    updated_at,
    user_id,
    lower(concat_ws(' '::text, ((first_name || ' '::text) || last_name), course, company_name)) AS search_text,
    privacy_consent,
    middle_name,
    mobile,
    is_employed,
    employment_type,
    job_status,
    date_hired,
    business_details,
    employment_location,
    studying_while_working,
    current_studies,
    looking_for_job,
    work_history,
    past_employment,
    employment_source,
    employment_source_detail
   FROM employment_surveys s;

create or replace view public.enrollment_analytics as
 SELECT s.name,
    s.type,
    count(DISTINCT l.id) AS total_leads,
    count(DISTINCT e.id) AS total_enrolled,
    round((((count(DISTINCT e.id))::numeric / (NULLIF(count(DISTINCT l.id), 0))::numeric) * (100)::numeric), 2) AS conversion_rate
   FROM ((schools s
     LEFT JOIN leads l ON ((l.school_id = s.id)))
     LEFT JOIN enrollments e ON ((e.school_id = s.id)))
  GROUP BY s.name, s.type
  ORDER BY (round((((count(DISTINCT e.id))::numeric / (NULLIF(count(DISTINCT l.id), 0))::numeric) * (100)::numeric), 2)) DESC;

create or replace view public.enrollments_with_pending_docs as
 SELECT e.id,
    e.lead_id,
    e.school_id,
    e.enrollment_date,
    e.student_id,
    e.education_level,
    e.grade_level,
    e.section,
    e.course,
    e.scholarship_type,
    e.is_walk_in,
    e.email,
    e.phone,
    e.created_at,
    e.updated_at,
    e.first_name,
    e.last_name,
    e.full_name,
    count(r.id) FILTER (WHERE ((r.status = 'to_follow'::requirement_status) AND r.is_required)) AS pending_required_docs,
    count(r.id) FILTER (WHERE (r.status = 'to_follow'::requirement_status)) AS pending_total_docs
   FROM (enrollments e
     LEFT JOIN enrollment_requirements r ON ((r.enrollment_id = e.id)))
  GROUP BY e.id;

create or replace view public.leads_per_school as
 SELECT s.id,
    s.name,
    s.type,
    count(l.id) AS total_leads
   FROM (schools s
     LEFT JOIN leads l ON ((l.school_id = s.id)))
  GROUP BY s.id
  ORDER BY (count(l.id)) DESC;

create or replace view public.marketing_dashboard_summary as
 SELECT ( SELECT count(*) AS count
           FROM leads) AS total_leads,
    ( SELECT count(*) AS count
           FROM schools
          WHERE (schools.type = 'feeder'::text)) AS feeder_schools,
    ( SELECT count(*) AS count
           FROM enrollments) AS total_enrolled;

create or replace view public.v_enrolled_students as
 SELECT e.id AS enrollment_id,
    e.lead_id,
    e.school_id,
    e.full_name,
    e.first_name,
    e.last_name,
    e.email,
    e.phone,
    e.student_id,
    e.education_level,
    e.grade_level,
    e.section,
    e.course,
    e.scholarship_type,
    e.is_walk_in,
    e.enrollment_date,
    s.name AS school_name,
    l.source AS lead_source,
    count(r.id) AS total_docs,
    count(r.id) FILTER (WHERE (r.status = 'received'::requirement_status)) AS docs_received,
    count(r.id) FILTER (WHERE (r.status = 'to_follow'::requirement_status)) AS docs_pending,
    count(r.id) FILTER (WHERE (r.file_url IS NOT NULL)) AS docs_uploaded,
    max(r.file_url) FILTER (WHERE ((lower(r.document_name) ~~ '%form 138%'::text) OR (lower(r.document_name) ~~ '%138%'::text))) AS form138_url
   FROM (((enrollments e
     LEFT JOIN leads l ON ((l.id = e.lead_id)))
     LEFT JOIN schools s ON ((s.id = e.school_id)))
     LEFT JOIN enrollment_requirements r ON ((r.enrollment_id = e.id)))
  GROUP BY e.id, s.name, l.source;

create or replace view public.v_enrollments as
 SELECT e.id,
    e.lead_id,
    e.school_id,
    COALESCE(NULLIF(TRIM(BOTH FROM ((COALESCE(e.first_name, ''::text) || ' '::text) || COALESCE(e.last_name, ''::text))), ''::text), TRIM(BOTH FROM ((COALESCE(l.first_name, ''::text) || ' '::text) || COALESCE(l.last_name, ''::text))), 'Unknown'::text) AS display_name,
    e.first_name,
    e.last_name,
    e.full_name,
    e.email,
    e.phone,
    e.student_id,
    e.education_level,
    e.grade_level,
    e.section,
    e.course,
    e.scholarship_type,
    e.is_walk_in,
    e.enrollment_date,
    e.created_at,
    e.updated_at,
    s.name AS school_name,
    l.source AS lead_source
   FROM ((enrollments e
     LEFT JOIN leads l ON ((l.id = e.lead_id)))
     LEFT JOIN schools s ON ((s.id = e.school_id)));

create or replace view public.v_graduated_by_school_origin as
 SELECT COALESCE(s.name, gs.school_origin, 'Unknown'::text) AS school_origin,
    COALESCE(s.type, gs.school_origin_type, 'unknown'::text) AS school_type,
    COALESCE(s.city, 'N/A'::text) AS city,
    gs.course,
    gs.school_year,
    gs.education_level,
    count(gs.id) AS total_graduates,
    round(avg((gs.gwa)::numeric), 2) AS avg_gwa
   FROM ((graduating_students gs
     LEFT JOIN enrollments e ON ((gs.enrollment_id = e.id)))
     LEFT JOIN schools s ON ((e.school_id = s.id)))
  WHERE (gs.status = 'graduated'::text)
  GROUP BY COALESCE(s.name, gs.school_origin, 'Unknown'::text), COALESCE(s.type, gs.school_origin_type, 'unknown'::text), COALESCE(s.city, 'N/A'::text), gs.course, gs.school_year, gs.education_level
  ORDER BY (count(gs.id)) DESC;

create or replace view public.v_graduation_rate_by_school as
 SELECT school_origin,
    school_type,
    city,
    sum(total_enrolled) AS total_enrolled,
    sum(total_graduated) AS total_graduated,
        CASE
            WHEN (sum(total_enrolled) > (0)::numeric) THEN round(((sum(total_graduated) / sum(total_enrolled)) * (100)::numeric), 2)
            ELSE (0)::numeric
        END AS graduation_rate_percent
   FROM ( SELECT s.name AS school_origin,
            s.type AS school_type,
            COALESCE(s.city, 'N/A'::text) AS city,
            count(DISTINCT e.student_id) AS total_enrolled,
            count(DISTINCT gs.id) AS total_graduated
           FROM ((schools s
             JOIN enrollments e ON ((e.school_id = s.id)))
             LEFT JOIN graduating_students gs ON (((gs.enrollment_id = e.id) AND (gs.status = 'graduated'::text))))
          GROUP BY s.name, s.type, s.city
        UNION ALL
         SELECT gs.school_origin,
            gs.school_origin_type,
            'N/A'::text AS city,
            0 AS total_enrolled,
            count(gs.id) AS total_graduated
           FROM graduating_students gs
          WHERE ((gs.status = 'graduated'::text) AND (gs.enrollment_id IS NULL) AND (gs.school_origin IS NOT NULL))
          GROUP BY gs.school_origin, gs.school_origin_type) combined
  GROUP BY school_origin, school_type, city
 HAVING ((sum(total_enrolled) > (0)::numeric) OR (sum(total_graduated) > (0)::numeric))
  ORDER BY (sum(total_graduated)) DESC,
        CASE
            WHEN (sum(total_enrolled) > (0)::numeric) THEN round(((sum(total_graduated) / sum(total_enrolled)) * (100)::numeric), 2)
            ELSE (0)::numeric
        END DESC;

create or replace view public.v_school_origin_graduate_summary as
 SELECT COALESCE(s.name, gs.school_origin, 'Unknown'::text) AS school_origin,
    COALESCE(s.type, gs.school_origin_type, 'unknown'::text) AS school_type,
    COALESCE(s.city, 'N/A'::text) AS city,
    count(gs.id) AS total_graduates,
    count(DISTINCT gs.school_year) AS school_years_represented,
    round(avg((gs.gwa)::numeric), 2) AS avg_gwa,
    string_agg(DISTINCT gs.course, ', '::text ORDER BY gs.course) AS courses
   FROM ((graduating_students gs
     LEFT JOIN enrollments e ON ((gs.enrollment_id = e.id)))
     LEFT JOIN schools s ON ((e.school_id = s.id)))
  WHERE (gs.status = 'graduated'::text)
  GROUP BY COALESCE(s.name, gs.school_origin, 'Unknown'::text), COALESCE(s.type, gs.school_origin_type, 'unknown'::text), COALESCE(s.city, 'N/A'::text)
  ORDER BY (count(gs.id)) DESC;
