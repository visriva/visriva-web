-- QR giveaway landing page settings + native form submissions.

create table if not exists public.qr_page_settings (
  id text primary key default 'qr_page',
  form_mode text not null default 'native' check (form_mode in ('native', 'external')),
  external_form_url text,
  whatsapp_number text,
  updated_at timestamptz not null default now()
);

insert into public.qr_page_settings (id, form_mode, external_form_url, whatsapp_number)
values ('qr_page', 'native', null, null)
on conflict (id) do nothing;

create table if not exists public.qr_giveaway_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  instagram_handle text not null,
  phone text not null,
  station text not null,
  screenshot_path text,
  screenshot_url text
);

create index if not exists qr_giveaway_entries_created_at_idx
  on public.qr_giveaway_entries (created_at desc);

alter table public.qr_page_settings enable row level security;
alter table public.qr_giveaway_entries enable row level security;

drop policy if exists "public read qr page settings" on public.qr_page_settings;
create policy "public read qr page settings"
  on public.qr_page_settings
  for select
  to anon, authenticated
  using (true);

revoke all on table public.qr_giveaway_entries from anon, authenticated;

-- Screenshots uploaded server-side (service role); public read via bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'qr-screenshots',
  'qr-screenshots',
  true,
  6291456,
  array ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do nothing;

drop policy if exists "public read qr screenshots" on storage.objects;
create policy "public read qr screenshots"
  on storage.objects
  for select
  to public
  using (bucket_id = 'qr-screenshots');