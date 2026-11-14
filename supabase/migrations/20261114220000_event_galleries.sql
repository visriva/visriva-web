-- Event photo vault: galleries + guest gatekeeper copy (admin CMS).

create table if not exists public.event_galleries (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  event_date date not null,
  password text not null,
  gallery_url text not null,
  embed_mode text not null default 'embed' check (embed_mode in ('embed', 'fullscreen')),
  is_active boolean not null default true,
  cover_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists event_galleries_active_date_idx
  on public.event_galleries (is_active, event_date desc);

create table if not exists public.event_photos_settings (
  id text primary key default 'main',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.event_photos_settings (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

alter table public.event_galleries enable row level security;
alter table public.event_photos_settings enable row level security;

-- No public policies: guest access via Next.js API routes (service role).