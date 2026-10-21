-- PYP Planner cloud schema
-- Run in the SQL Editor of a NEW Supabase project dedicated to the PYP Planner.
-- Keep the Assessly/A2Grammar project and its tables untouched.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'My planning workspace',
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'teacher' check (role in ('owner','teacher')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.unit_drafts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  poi_entry_id text,
  title text not null default 'Untitled unit',
  year_group text,
  transdisciplinary_theme text,
  status text not null default 'draft' check (status in ('draft','in_progress','completed','archived')),
  plan jsonb not null default '{}'::jsonb,
  lessons jsonb not null default '[]'::jsonb,
  teaching_log jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists unit_drafts_owner_updated_idx
  on public.unit_drafts(owner_id, updated_at desc);
create index if not exists unit_drafts_workspace_updated_idx
  on public.unit_drafts(workspace_id, updated_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists unit_drafts_set_updated_at on public.unit_drafts;
create trigger unit_drafts_set_updated_at before update on public.unit_drafts
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.unit_drafts enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
for select to authenticated using (id = (select auth.uid()));
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
for insert to authenticated with check (id = (select auth.uid()));
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Security-definer helper avoids recursive RLS checks across workspace membership.
create or replace function public.is_workspace_member(target_workspace uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = target_workspace and wm.user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_workspace_member(uuid) from public;
grant execute on function public.is_workspace_member(uuid) to authenticated;

drop policy if exists "Members can view their workspaces" on public.workspaces;
create policy "Members can view their workspaces" on public.workspaces
for select to authenticated using (
  created_by = (select auth.uid()) or public.is_workspace_member(id)
);
drop policy if exists "Authenticated users can create workspaces" on public.workspaces;
create policy "Authenticated users can create workspaces" on public.workspaces
for insert to authenticated with check (created_by = (select auth.uid()));
drop policy if exists "Workspace creators can update workspaces" on public.workspaces;
create policy "Workspace creators can update workspaces" on public.workspaces
for update to authenticated using (created_by = (select auth.uid())) with check (created_by = (select auth.uid()));

drop policy if exists "Workspace creators can add members" on public.workspace_members;
create policy "Workspace creators can add members" on public.workspace_members
for insert to authenticated with check (exists (
  select 1 from public.workspaces w
  where w.id = workspace_id and w.created_by = (select auth.uid())
));
drop policy if exists "Members can view workspace membership" on public.workspace_members;
create policy "Members can view workspace membership" on public.workspace_members
for select to authenticated using (
  user_id = (select auth.uid()) or exists (
    select 1 from public.workspaces w
    where w.id = workspace_id and w.created_by = (select auth.uid())
  )
);
drop policy if exists "Workspace creators can remove members" on public.workspace_members;
create policy "Workspace creators can remove members" on public.workspace_members
for delete to authenticated using (exists (
  select 1 from public.workspaces w
  where w.id = workspace_id and w.created_by = (select auth.uid())
));

drop policy if exists "Users can view own or shared unit drafts" on public.unit_drafts;
create policy "Users can view own or shared unit drafts" on public.unit_drafts
for select to authenticated using (
  owner_id = (select auth.uid()) or (
    workspace_id is not null and public.is_workspace_member(workspace_id)
  )
);
drop policy if exists "Users can create own unit drafts" on public.unit_drafts;
create policy "Users can create own unit drafts" on public.unit_drafts
for insert to authenticated with check (owner_id = (select auth.uid()));
drop policy if exists "Owners or workspace members can update drafts" on public.unit_drafts;
create policy "Owners or workspace members can update drafts" on public.unit_drafts
for update to authenticated using (
  owner_id = (select auth.uid()) or (
    workspace_id is not null and public.is_workspace_member(workspace_id)
  )
) with check (
  owner_id = (select auth.uid()) or (
    workspace_id is not null and public.is_workspace_member(workspace_id)
  )
);
drop policy if exists "Owners or workspace members can delete drafts" on public.unit_drafts;
create policy "Owners or workspace members can delete drafts" on public.unit_drafts
for delete to authenticated using (
  owner_id = (select auth.uid()) or (
    workspace_id is not null and public.is_workspace_member(workspace_id)
  )
);

-- A user's profile is created automatically on signup.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
