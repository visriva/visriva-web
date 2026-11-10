-- Extend public.services for CMS workflow (reuse existing table).

alter table public.services
  add column if not exists publish_status text not null default 'published'
    check (publish_status in ('draft', 'preview', 'published', 'archived')),
  add column if not exists coming_soon boolean not null default false,
  add column if not exists image_path text,
  add column if not exists includes jsonb not null default '[]'::jsonb,
  add column if not exists footprint text,
  add column if not exists guest_moment text,
  add column if not exists unit_label text,
  add column if not exists duration_minutes integer,
  add column if not exists description text,
  add column if not exists specs jsonb not null default '{}'::jsonb,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists published_at timestamptz;

update public.services
set publish_status = case when active then 'published' else 'archived' end
where publish_status is distinct from case when active then 'published' else 'archived' end;

create table if not exists public.service_versions (
  id uuid primary key default gen_random_uuid(),
  service_id text not null references public.services (id) on delete cascade,
  snapshot jsonb not null,
  published_at timestamptz not null default now(),
  published_by text
);

create index if not exists service_versions_service_id_idx on public.service_versions (service_id, published_at desc);

drop policy if exists "public read active services" on public.services;
create policy "public read published services"
  on public.services
  for select
  to anon, authenticated
  using (publish_status = 'published');

alter table public.service_versions enable row level security;
revoke all on table public.service_versions from anon, authenticated;

-- Draft catalogue rows for future experiences (no invented prices).
insert into public.services (id, name, category, price_label, from_price, unit_price, summary, sort_order, active, publish_status, coming_soon)
values
  ('ai-photo-booth', 'AI Photo Booth', 'photo-booths', 'Price on request', null, null, 'AI-guided capture station. Pricing to be confirmed.', 20, false, 'draft', true),
  ('cap-customisation', 'Cap Customisation', 'ai-merchandise', 'Price on request', null, null, 'Live cap branding station.', 21, false, 'draft', true),
  ('tumbler-uv-stickers', 'Tumbler UV Stickers', 'ai-merchandise', 'Price on request', null, null, 'UV sticker application on tumblers.', 22, false, 'draft', true),
  ('acrylic-fridge-magnets', 'Acrylic Fridge Magnets', 'ai-merchandise', 'Price on request', null, null, 'Acrylic magnet keepsakes.', 23, false, 'draft', true),
  ('keychains-station', 'Keychains', 'ai-merchandise', 'Price on request', null, null, 'Live keychain station.', 24, false, 'draft', true),
  ('charm-bar', 'Charm Bar', 'ai-merchandise', 'Price on request', null, null, 'Guest-assembled charm jewellery bar.', 25, false, 'draft', true),
  ('phone-leashes', 'Phone Leashes', 'ai-merchandise', 'Price on request', null, null, 'Branded phone leash station.', 26, false, 'draft', true),
  ('pottery-station', 'Pottery', 'ai-merchandise', 'Price on request', null, null, 'Hosted pottery experience.', 27, false, 'draft', true),
  ('kundan-henna', 'Kundan Henna', 'ai-merchandise', 'Price on request', null, null, 'Kundan and henna artistry station.', 28, false, 'draft', true),
  ('phone-wallets', 'Phone Wallets', 'ai-merchandise', 'Price on request', null, null, 'Custom phone wallet station.', 29, false, 'draft', true)
on conflict (id) do nothing;

-- Storage bucket for service images (public read).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'service-images',
  'service-images',
  true,
  5242880,
  array ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

drop policy if exists "public read service images" on storage.objects;
create policy "public read service images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'service-images');


-- Public enquiry submissions use the publishable key and a narrow insert-only policy.
grant insert on table public.leads to anon, authenticated;
drop policy if exists "public submit event leads" on public.leads;
create policy "public submit event leads"
  on public.leads
  for insert
  to anon, authenticated
  with check (
    accepted_terms is true
    and status = 'new'
    and source = 'website'
    and (
      nullif(trim(coalesce(email, '')), '') is not null
      or nullif(trim(coalesce(phone, '')), '') is not null
    )
  );

-- Make the two requested new experiences public without inventing prices.
insert into public.services (id, name, category, price_label, from_price, unit_price, summary, sort_order, active, publish_status, coming_soon)
values
  ('ai-photo-booth', 'AI Photo Booth', 'photo-booths', 'Price on request', null, null, 'An AI-led photo experience for event guests, with creative direction and outputs tailored to the event brief.', 30, true, 'published', false),
  ('vr-engagement', 'VR Engagement', 'games', 'Price on request', null, null, 'A hosted virtual-reality experience for event guests, scoped to the event format and venue.', 31, true, 'published', false)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  price_label = excluded.price_label,
  from_price = excluded.from_price,
  unit_price = excluded.unit_price,
  summary = excluded.summary,
  sort_order = excluded.sort_order,
  active = true,
  publish_status = 'published',
  coming_soon = false;
