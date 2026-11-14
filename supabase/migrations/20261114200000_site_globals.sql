create table if not exists public.site_globals (
  id text primary key default 'main',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_globals (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

alter table public.site_globals enable row level security;

drop policy if exists "public read site globals" on public.site_globals;
create policy "public read site globals"
  on public.site_globals
  for select
  to anon, authenticated
  using (true);