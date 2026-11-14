create table if not exists public.pricing_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  station_type text not null default '',
  rate_inr integer not null default 0,
  unit_label text not null default 'per event',
  gst_note text not null default '',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  station_id text,
  status text not null default 'available' check (status in ('available', 'reserved', 'on_event', 'maintenance')),
  notes text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_bookings (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  client_name text not null default '',
  event_date date,
  venue text not null default '',
  status text not null default 'tentative' check (status in ('tentative', 'confirmed', 'completed', 'cancelled')),
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.studio_customers (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_name text not null default '',
  phone text not null default '',
  email text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.pricing_packages enable row level security;
alter table public.inventory_items enable row level security;
alter table public.studio_bookings enable row level security;
alter table public.studio_customers enable row level security;