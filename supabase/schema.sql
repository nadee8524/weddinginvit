create table if not exists public.rsvps(
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  attending boolean not null,
  guest_count int not null default 0,
  guest_names text default '',
  message text default '',
  created_at timestamptz not null default now());
create table if not exists public.site_content(
  id int primary key check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now());
-- RLS on with no policies: the public anon key can read/write nothing.
-- All access goes through server API routes using the service role key.
alter table public.rsvps enable row level security;
alter table public.site_content enable row level security;
insert into storage.buckets (id,name,public) values ('invitation','invitation',true) on conflict (id) do nothing;
