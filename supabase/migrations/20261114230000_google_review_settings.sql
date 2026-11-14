-- Google Review Studio CMS (curated wall + launch URL; no iframe to g.page).

create table if not exists public.google_review_settings (
  id text primary key default 'main',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.google_review_settings (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

alter table public.google_review_settings enable row level security;