-- Live visual builder draft/publish snapshots (admin service role only).
create table if not exists public.site_visual_builder (
  page_key text primary key,
  draft_state jsonb not null default '{}'::jsonb,
  published_state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_visual_builder enable row level security;
revoke all on table public.site_visual_builder from anon, authenticated;

insert into public.site_visual_builder (page_key, draft_state, published_state)
values
  ('home', '{}'::jsonb, '{}'::jsonb),
  ('services', '{}'::jsonb, '{}'::jsonb),
  ('qr', '{}'::jsonb, '{}'::jsonb),
  ('reviews', '{}'::jsonb, '{}'::jsonb)
on conflict (page_key) do nothing;