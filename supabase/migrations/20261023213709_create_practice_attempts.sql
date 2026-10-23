-- Practice history: one row per finished task, test or mock exam.
-- The full attempt (answers, feedback, review data) is stored as JSON in `data`;
-- a few columns are pulled out for listing and charts.

create table public.practice_attempts (
  user_id uuid not null references auth.users (id) on delete cascade,
  -- Generated in the browser so an attempt can be saved locally first and uploaded later.
  id text not null check (char_length(id) between 8 and 64),
  kind text not null check (kind in ('reading', 'listening', 'writing', 'speaking', 'exam')),
  task_id text not null check (char_length(task_id) <= 64),
  task_name text not null check (char_length(task_name) <= 200),
  prompt_title text check (char_length(prompt_title) <= 300),
  level numeric(4, 1) check (level between 0 and 12),
  data jsonb not null check (pg_column_size(data) <= 1000000),
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

comment on table public.practice_attempts is 'Each user''s practice history. Users can only see, add and delete their own rows.';

create index practice_attempts_user_created_idx on public.practice_attempts (user_id, created_at desc);

alter table public.practice_attempts enable row level security;

create policy "Users can view their own attempts"
  on public.practice_attempts for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own attempts"
  on public.practice_attempts for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own attempts"
  on public.practice_attempts for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Not exposed automatically: grant explicitly. No anon access, no updates (attempts are immutable).
revoke all on public.practice_attempts from anon, authenticated;
grant select, insert, delete on public.practice_attempts to authenticated;
