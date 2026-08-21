create extension if not exists pgcrypto;

create table if not exists public.coastal_needs_analysis_responses (
  id uuid primary key default gen_random_uuid(),
  submission_code text not null unique,
  submitted_at timestamptz not null default now(),
  respondent_name text not null,
  position text not null,
  department_faculty text,
  campus_office text,
  email text not null,
  contact_number text,
  answers jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists coastal_needs_analysis_submitted_at_idx
  on public.coastal_needs_analysis_responses (submitted_at desc);

create index if not exists coastal_needs_analysis_answers_gin_idx
  on public.coastal_needs_analysis_responses using gin (answers);

alter table public.coastal_needs_analysis_responses enable row level security;

-- No public RLS policies are created intentionally.
-- The browser never connects directly to Supabase.
-- Netlify Functions use the service-role key stored as a server-side environment variable.
