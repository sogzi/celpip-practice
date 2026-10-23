-- One row per AI call (scoring or generation), for daily limits and cost tracking.
-- Rows are written only by the server with the secret key; users can read their own.

create table public.ai_usage (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('score', 'generate_test', 'generate_prompt')),
  -- 'pending' while the AI call runs (so it counts towards the limit), then 'done'.
  status text not null default 'pending' check (status in ('pending', 'done')),
  model text,
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  cost_usd numeric(10, 6) not null default 0 check (cost_usd >= 0),
  created_at timestamptz not null default now()
);

comment on table public.ai_usage is 'AI calls per user for daily limits and cost reporting. Inserted by the server only.';

create index ai_usage_user_kind_created_idx on public.ai_usage (user_id, kind, created_at desc);
create index ai_usage_created_idx on public.ai_usage (created_at desc);

alter table public.ai_usage enable row level security;

create policy "Users can view their own AI usage"
  on public.ai_usage for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Read-only for signed-in users (to show "N scores left today"); no anon access.
-- Inserts, updates and deletes happen only through the server's secret key.
revoke all on public.ai_usage from anon, authenticated;
grant select on public.ai_usage to authenticated;
