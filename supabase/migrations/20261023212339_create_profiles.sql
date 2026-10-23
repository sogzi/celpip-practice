-- User profiles: one row per auth user, created automatically on sign-up.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text check (char_length(full_name) <= 100),
  avatar_url text,
  target_level smallint check (target_level between 1 and 12),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Public profile data for each user. Rows are created by private.handle_new_user().';

-- Row level security: each user can read and update only their own profile.
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Tables aren't exposed to the Data API automatically any more, so grant explicitly.
-- No access for anon. Authenticated users can read their row and edit only the
-- columns they own; id, email, avatar and timestamps are managed by triggers.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, target_level) on public.profiles to authenticated;

-- Trigger functions live in a schema that isn't exposed through the Data API.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Create a profile when a user signs up (email/password or Google).
-- raw_user_meta_data is user-editable, so it's only used for display fields here.
create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'), 100),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

-- Keep the profile email in sync if the user changes it.
create function private.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

create function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;
revoke all on function private.handle_user_email_change() from public, anon, authenticated;
revoke all on function private.set_updated_at() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function private.handle_user_email_change();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function private.set_updated_at();
