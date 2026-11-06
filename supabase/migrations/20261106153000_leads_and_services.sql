-- Visriva leads and public service catalog.
-- Apply in the Supabase SQL editor, or with the Supabase CLI once the project is linked.

create table if not exists public.services (
  id text primary key,
  name text not null,
  category text not null,
  price_label text not null,
  from_price integer,
  unit_price integer,
  summary text not null,
  sort_order integer not null default 0,
  active boolean not null default true
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'confirmed', 'closed')),
  services jsonb not null default '[]'::jsonb,
  venue text,
  city text,
  event_date date,
  start_time text,
  end_time text,
  headcount integer,
  contact_name text,
  company text,
  phone text,
  email text,
  notes text,
  estimated_from numeric,
  accepted_terms boolean not null default false,
  source text default 'website',
  details jsonb not null default '{}'::jsonb
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

alter table public.services enable row level security;
alter table public.leads enable row level security;

drop policy if exists "public read active services" on public.services;
create policy "public read active services"
  on public.services
  for select
  to anon, authenticated
  using (active = true);

revoke all on table public.leads from anon, authenticated;

insert into public.services (id, name, category, price_label, from_price, unit_price, summary, sort_order)
values
  ('starter-ipad', 'Starter Instant iPad', 'photo-booths', 'Starting ₹15,000', 15000, null, '3 hours, 150 prints.', 1),
  ('unlimited-ipad', 'Unlimited Instant iPad', 'photo-booths', '₹25,000', 25000, null, '4 hours, unlimited prints.', 2),
  ('unlimited-dslr', 'Unlimited Instant DSLR', 'photo-booths', '₹30,000', 30000, null, '4 hours, DSLR, unlimited prints.', 3),
  ('roaming-booth', 'Roaming Booth', 'photo-booths', '₹25,000 – ₹30,000', 25000, null, 'Attended roaming capture.', 4),
  ('mobile-capture', 'Mobile Phone Capture', 'photo-booths', '₹15,000 – ₹18,000', 15000, null, 'Guided phone capture.', 5),
  ('ai-station', 'AI Experience Station', 'ai-merchandise', '₹25,000', 25000, null, 'Includes custom prompts.', 6),
  ('tote-100', 'Canvas Tote Stamp · 100 bags', 'ai-merchandise', '₹25,000', 25000, null, '100 canvas bags.', 7),
  ('tote-200', 'Canvas Tote Stamp · 200 bags', 'ai-merchandise', '₹40,000', 40000, null, '200 canvas bags.', 8),
  ('fridge-magnets', 'Fridge Magnets & Keychains', 'ai-merchandise', '₹25,000', 25000, null, '300 pieces.', 9),
  ('pvc-cards', 'Corporate PVC ID Cards', 'ai-merchandise', '₹120 per card', null, 120, 'Priced per card.', 10),
  ('dtf-tees', 'Live T-shirt Printing (DTF)', 'ai-merchandise', 'Custom quote', null, null, 'Quoted to the run.', 11),
  ('vr-station', 'VR Station', 'games', '₹20,000', 20000, null, 'Hosted VR station.', 12),
  ('catch-baton', 'Catch the Baton', 'games', '₹6,000 – ₹8,000', 6000, null, 'Hosted game.', 13),
  ('buzz-wire', 'Buzz the Wire', 'games', '₹6,000 – ₹8,000', 6000, null, 'Hosted game.', 14)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  price_label = excluded.price_label,
  from_price = excluded.from_price,
  unit_price = excluded.unit_price,
  summary = excluded.summary,
  sort_order = excluded.sort_order;
