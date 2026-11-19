-- STI-360 database structure (no row data), read from the live project's catalog.
-- Types, sequences and tables.

create type public.requirement_status as enum ('received', 'to_follow', 'pending');
create type public.user_role as enum ('student', 'admin', 'marketing', 'front_desk', 'guidance');
create sequence if not exists public.ched_hei_list_id_seq;
create sequence if not exists public.deped_masterlist_id_seq;

create table public.archive_snapshots (
  id uuid default gen_random_uuid() not null,
  month text not null,
  part integer not null,
  parts integer not null,
  storage_path text not null,
  record_count integer not null,
  size_bytes bigint not null,
  sha256 text not null,
  created_by uuid,
  created_at timestamp with time zone default now() not null
);
create table public.archive_vault (
  id uuid not null,
  source_table text not null,
  source_id uuid not null,
  summary jsonb default '{}'::jsonb not null,
  archived_at timestamp with time zone not null,
  archived_by uuid,
  archived_by_email text,
  archive_reason text,
  moved_at timestamp with time zone default now() not null,
  storage_path text not null,
  size_bytes bigint not null,
  sha256 text not null
);
create table public.archived_records (
  id uuid default gen_random_uuid() not null,
  source_table text not null,
  source_id uuid not null,
  archived_data jsonb not null,
  archived_by uuid,
  archived_by_email text,
  archive_reason text,
  archived_at timestamp with time zone default now() not null,
  auto_delete_at timestamp with time zone default (now() + '30 days'::interval) not null,
  related jsonb default '{}'::jsonb not null
);
create table public.at_risk_cases (
  case_key text not null,
  student_id text,
  student_name text,
  status text default 'new'::text not null,
  follow_up_date date,
  updated_at timestamp with time zone default now() not null,
  updated_by uuid default auth.uid(),
  updated_by_email text,
  referred_to text,
  remarks text
);
create table public.audit_logs (
  id uuid default gen_random_uuid() not null,
  action text not null,
  actor_id uuid,
  actor_email text,
  target_id uuid,
  target_email text,
  details text,
  created_at timestamp with time zone default now() not null,
  table_name text,
  record_id uuid
);
create table public.authorized_accounts (
  id uuid default gen_random_uuid() not null,
  email text not null,
  first_name text not null,
  last_name text,
  role text not null,
  is_active boolean default true not null,
  created_by uuid,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  deactivation_reason text,
  ms_verified_at timestamp with time zone,
  ms_checked_at timestamp with time zone
);
create table public.ched_hei_list (
  id bigint default nextval('ched_hei_list_id_seq'::regclass) not null,
  institution_code text,
  institution_name text not null,
  region text,
  province text,
  city_municipality text,
  address text,
  type text,
  status text,
  search_vec tsvector generated always as (to_tsvector('simple'::regconfig, ((((((COALESCE(institution_name, ''::text) || ' '::text) || COALESCE(city_municipality, ''::text)) || ' '::text) || COALESCE(province, ''::text)) || ' '::text) || COALESCE(region, ''::text)))) stored
);
create table public.counseling_records (
  id uuid default gen_random_uuid() not null,
  student_id text not null,
  enrollment_id uuid,
  first_name text,
  last_name text,
  email text,
  course text,
  concern text,
  session_date date not null,
  session_type text,
  counselor_notes text,
  follow_up_date date,
  status text default 'open'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  user_id uuid,
  case_key text
);
create table public.curriculum_subjects (
  id uuid default gen_random_uuid() not null,
  program text default 'BSIT'::text not null,
  year_level text not null,
  semester text not null,
  code text not null,
  title text not null,
  units integer not null,
  prereq text,
  created_at timestamp with time zone default now(),
  semester_availability text default 'Both'::text,
  course_id text
);
create table public.curriculum_subjects_backup_20261112 (
  id uuid,
  program text,
  year_level text,
  semester text,
  code text,
  title text,
  units integer,
  prereq text,
  created_at timestamp with time zone,
  semester_availability text,
  course_id text
);
create table public.deped_masterlist (
  id bigint default nextval('deped_masterlist_id_seq'::regclass) not null,
  beis_id text,
  school_name text not null,
  level_code text,
  level_label text,
  region text,
  province text,
  municipality text,
  division text,
  lat double precision,
  lng double precision,
  search_vec tsvector generated always as (to_tsvector('simple'::regconfig, ((((((((COALESCE(school_name, ''::text) || ' '::text) || COALESCE(municipality, ''::text)) || ' '::text) || COALESCE(province, ''::text)) || ' '::text) || COALESCE(division, ''::text)) || ' '::text) || COALESCE(region, ''::text)))) stored
);
create table public.employment_surveys (
  id uuid default gen_random_uuid() not null,
  student_id text,
  first_name text not null,
  last_name text not null,
  email text,
  course text,
  graduation_year integer,
  school_year text,
  employment_status text default 'Unemployed'::text not null,
  company_name text,
  job_title text,
  industry text,
  monthly_salary numeric(10,2),
  months_to_employment integer,
  unemployment_reason text,
  is_aligned_to_course boolean,
  survey_date date default CURRENT_DATE not null,
  remarks text,
  enrollment_id uuid,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  user_id uuid,
  privacy_consent boolean,
  middle_name text,
  mobile text,
  is_employed boolean,
  employment_type text,
  job_status text,
  date_hired text,
  business_details text,
  employment_location text,
  studying_while_working boolean,
  current_studies text,
  looking_for_job boolean,
  work_history text,
  past_employment text,
  employment_source text,
  employment_source_detail text
);
create table public.enrollment_requirements (
  id uuid default uuid_generate_v4() not null,
  enrollment_id uuid not null,
  document_name text not null,
  is_required boolean default true not null,
  status requirement_status default 'to_follow'::requirement_status not null,
  received_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  file_url text,
  file_name text,
  file_size bigint,
  file_type text,
  extracted_gwa numeric,
  extracted_math_grade numeric,
  extracted_english_grade numeric,
  extracted_grades_json jsonb,
  extraction_status text,
  extraction_notes text,
  shs_english_grade numeric,
  shs_math_grade numeric,
  shs_gwa numeric,
  storage_path text,
  extracted_at timestamp with time zone,
  extraction_model text
);
create table public.enrollments (
  id uuid default uuid_generate_v4() not null,
  lead_id uuid,
  school_id uuid,
  enrollment_date timestamp without time zone default now(),
  student_id text,
  education_level text,
  grade_level text,
  section text,
  course text,
  scholarship_type text default 'none'::text not null,
  is_walk_in boolean default false not null,
  email text,
  phone text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  first_name text,
  last_name text,
  full_name text generated always as (TRIM(BOTH FROM ((COALESCE(first_name, ''::text) || ' '::text) || COALESCE(last_name, ''::text)))) stored,
  scholarship_status text default 'pending'::text,
  shs_gwa numeric(4,2),
  shs_math_grade numeric(4,2),
  shs_english_grade numeric(4,2),
  predicted_wss numeric(5,2),
  predicted_zone text,
  prediction_note text,
  reading_verbal numeric(5,2),
  numerical numeric(5,2),
  abstract numeric(5,2),
  digital_literacy numeric(5,2),
  psychometric numeric(6,2),
  exam_date date,
  exam_passed boolean,
  year_level text,
  school_year text,
  prediction_confidence text,
  prediction_trend text,
  scholarship_id uuid,
  user_id uuid,
  semester text,
  student_type text default 'Regular'::text not null,
  school_name text
);
create table public.fari_ai_analyses (
  submission_id uuid not null,
  input_hash text not null,
  model text,
  analysis jsonb not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);
create table public.fari_questions (
  id uuid default gen_random_uuid() not null,
  item_number integer not null,
  section_key text not null,
  passage_context text,
  question_text text default ''::text not null,
  options jsonb,
  correct_answer text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);
create table public.fari_submissions (
  id uuid default gen_random_uuid() not null,
  temp_account_id uuid,
  student_name text not null,
  student_lrn text,
  raw_reading_verbal integer default 0,
  raw_numerical integer default 0,
  raw_abstract integer default 0,
  raw_digital_literacy integer default 0,
  raw_psychometric_sum integer default 0,
  item_answers jsonb default '{}'::jsonb,
  wss numeric,
  zone text,
  submitted_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  status text default 'pending'::text not null,
  reviewed_at timestamp with time zone,
  section_max jsonb,
  reviewed_by uuid,
  reviewed_by_email text,
  counseling_case_key text
);
create table public.form138_grades (
  id uuid default gen_random_uuid() not null,
  student_lrn text not null,
  student_name text not null,
  grade_level text not null,
  school_year text not null,
  subjects jsonb default '[]'::jsonb not null,
  general_average numeric(5,2),
  remarks text,
  encoded_by text,
  encoded_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create table public.graduating_students (
  id uuid default gen_random_uuid() not null,
  student_id text,
  first_name text not null,
  last_name text not null,
  email text,
  course text,
  strand text,
  education_level text default 'college'::text not null,
  school_year text,
  gwa numeric(5,2),
  remarks text,
  graduation_date date,
  status text default 'pending'::text not null,
  enrollment_id uuid,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  guidance_user_id uuid,
  created_by_admin boolean default false not null,
  school_origin text,
  school_origin_type text default 'unknown'::text,
  user_id uuid
);
create table public.leads (
  id uuid default uuid_generate_v4() not null,
  first_name text,
  last_name text,
  email text,
  phone text,
  school_id uuid,
  status text default 'new'::text,
  created_at timestamp without time zone default now(),
  source text,
  notes text,
  school_name text,
  is_feeder boolean,
  suffix text
);
create table public.programs (
  code text not null,
  name text not null,
  education_level text default 'college'::text not null,
  is_active boolean default true not null,
  sort_order integer default 0 not null,
  created_at timestamp with time zone default now() not null
);
create table public.reports (
  id uuid default uuid_generate_v4() not null,
  title text not null,
  type text not null,
  generated_by uuid,
  data jsonb,
  status text default 'pending'::text,
  created_at timestamp without time zone default now(),
  role_target text,
  period_label text,
  is_auto boolean default false,
  scheduled_month integer,
  scheduled_year integer
);
create table public.scholar_batch (
  id uuid default gen_random_uuid() not null,
  email text not null,
  student_name text,
  scholarship_type text not null,
  scholarship_name text,
  scholar_status text default 'active'::text not null,
  school_year text,
  semester text,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  user_id uuid
);
create table public.scholarships (
  id uuid default gen_random_uuid() not null,
  name text not null,
  description text,
  min_gwa numeric(4,2) not null,
  income_limit integer,
  coverage text not null,
  slots integer default 0 not null,
  requirements text[] default '{}'::text[] not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create table public.schools (
  id uuid default uuid_generate_v4() not null,
  name text not null,
  type text not null,
  city text,
  created_at timestamp without time zone default now(),
  lat double precision,
  lng double precision,
  offers_college boolean default false not null,
  offers_secondary boolean default true not null,
  registry_id text,
  registry_source text
);
create table public.sections (
  id uuid default gen_random_uuid() not null,
  program text not null,
  year_level text not null,
  section_name text not null,
  school_year text not null,
  semester text not null,
  capacity integer default 40
);
create table public.semester_settings (
  id integer default 1 not null,
  school_year text not null,
  semester text not null,
  enrollment_open boolean default true,
  updated_at timestamp with time zone default now()
);
create table public.student_grades (
  id uuid default gen_random_uuid() not null,
  student_id uuid,
  subject_code text not null,
  grade text,
  school_year text,
  semester text,
  grade_type text,
  file_url text,
  verified boolean default false,
  created_at timestamp with time zone default now(),
  prelim numeric,
  midterm numeric,
  pre_finals numeric,
  finals numeric,
  final_grade text
);
create table public.student_profiles (
  id uuid not null,
  student_id text,
  first_name text not null,
  middle_name text,
  last_name text not null,
  suffix text,
  email text not null,
  phone text,
  birthdate date,
  gender text,
  nationality text,
  civil_status text,
  religion text,
  address text,
  city text,
  barangay text,
  zip_code text,
  program text not null,
  year_level text not null,
  section text not null,
  onboarded boolean default false not null,
  created_at timestamp with time zone default now(),
  student_type text,
  updated_at timestamp with time zone,
  sem_updated boolean default false,
  annual_family_income numeric(12,2)
);
create table public.system_alerts (
  id uuid default gen_random_uuid() not null,
  kind text not null,
  status text default 'open'::text not null,
  subject_email text,
  details text,
  created_at timestamp with time zone default now() not null,
  resolved_at timestamp with time zone,
  resolved_by uuid,
  expires_at timestamp with time zone,
  created_by uuid
);
create table public.temp_exam_accounts (
  id uuid default gen_random_uuid() not null,
  student_name text not null,
  student_lrn text,
  email text not null,
  password text not null,
  source text,
  source_id uuid,
  is_used boolean default false,
  expires_at timestamp with time zone default (now() + '7 days'::interval),
  created_at timestamp with time zone default now(),
  created_by uuid,
  opened_at timestamp with time zone,
  archived_at timestamp with time zone,
  session_token uuid,
  session_expires_at timestamp with time zone,
  failed_attempts integer default 0 not null,
  locked_until timestamp with time zone,
  first_name text,
  last_name text,
  phone text,
  enrollment_id uuid,
  linked_by text
);
create table public.user_active_sessions (
  user_id uuid not null,
  session_id uuid not null,
  session_created_at timestamp with time zone not null,
  updated_at timestamp with time zone default now() not null
);
create table public.users (
  id uuid not null,
  email text not null,
  first_name text not null,
  last_name text not null,
  role text default 'student'::text not null,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  full_name text generated always as (TRIM(BOTH FROM ((COALESCE(first_name, ''::text) || ' '::text) || COALESCE(last_name, ''::text)))) stored
);
