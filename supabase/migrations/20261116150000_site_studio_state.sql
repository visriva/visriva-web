-- Visriva Pro Visual Studio — per-page DOM override schema (draft + published).
create table if not exists public.site_studio_state (
  page_key text primary key,
  draft_state jsonb not null default '{}'::jsonb,
  published_state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_studio_state enable row level security;
revoke all on table public.site_studio_state from anon, authenticated;

insert into public.site_studio_state (page_key, draft_state, published_state)
values
  ('home', '{}'::jsonb, '{}'::jsonb),
  ('services', '{}'::jsonb, '{}'::jsonb),
  ('qr', '{}'::jsonb, '{}'::jsonb),
  ('reviews', '{}'::jsonb, '{}'::jsonb)
on conflict (page_key) do nothing;