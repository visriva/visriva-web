-- Visriva page-level CMS. Public pages are read server-side; writes use service role behind admin auth.
create table if not exists public.website_pages (
  slug text primary key,
  name text not null,
  status text not null default 'draft' check (status in ('draft','published')),
  eyebrow text not null default '',
  hero_title text not null default '',
  hero_accent text not null default '',
  hero_description text not null default '',
  hero_image text not null default '',
  hero_alt text not null default '',
  intro_title text not null default '',
  intro_copy text not null default '',
  closing_title text not null default '',
  closing_copy text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  og_image text not null default '',
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
alter table public.website_pages enable row level security;
revoke all on table public.website_pages from anon, authenticated;
insert into public.website_pages (slug,name,status) values
 ('home','Home','published'),
 ('photo-booths','Photo Booths','published'),
 ('ai-merchandise','AI Merchandise','published'),
 ('games-vr','Games & VR','published'),
 ('about','About','published'),
 ('gallery','Gallery','published'),
 ('rate-card','Rate Card','published'),
 ('client-requirements','Client Requirements','published'),
 ('quote','Quote','published')
on conflict (slug) do nothing;
