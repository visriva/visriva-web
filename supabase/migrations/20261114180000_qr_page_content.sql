-- Editable visual content for visriva.com/qr (JSON document).

create table if not exists public.qr_page_content (
  id text primary key default 'qr_page',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.qr_page_content (id, content)
values ('qr_page', '{}'::jsonb)
on conflict (id) do nothing;

alter table public.qr_page_content enable row level security;

drop policy if exists "public read qr page content" on public.qr_page_content;
create policy "public read qr page content"
  on public.qr_page_content
  for select
  to anon, authenticated
  using (true);