# Visriva

Marketing site for **Visriva** — corporate event stations in Bengaluru (photo booths, AI & merchandise, games & VR). Built with **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS v4**, and **Supabase** for quote leads.

## Local development

```bash
npm install
cp .env.example .env.local
# fill .env.local (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` and set:

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical URL for metadata, sitemap, robots |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Recommended | `wa.me` link after quote submit |
| `NEXT_PUBLIC_SUPABASE_URL` | For saved leads | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | For saved leads | Inserts leads server-side only — never expose to the client |
| `ADMIN_PASSWORD` | For `/admin` | Simple studio password for lead inbox |
| `ADMIN_SESSION_SECRET` | For `/admin` | Cookie signing secret |
| `NEXT_PUBLIC_GSTIN`, social URLs | Optional | Footer and contact |

Apply the SQL in `supabase/migrations/20261106153000_leads_and_services.sql` in the Supabase SQL editor (or CLI) before expecting inserts to succeed.

## Deploy on Vercel

1. Push this repo to GitHub (see below).
2. In [Vercel](https://vercel.com): **Add New Project** → import the GitHub repo → Framework Preset: Next.js.
3. Add the same variables as `.env.example` in **Project → Settings → Environment Variables** (Production + Preview).
4. Redeploy.

CLI (from repo root, logged in as `vercel login`):

```bash
vercel link --yes --project visriva
vercel --prod
```

## GitHub

Create a repository (e.g. `visriva-web`) and push:

```bash
git remote add origin https://github.com/YOUR_ORG/visriva-web.git
git push -u origin main
```

If `gh` shows an invalid token, run `gh auth login -h github.com` and try again. To create and push in one step:

```bash
gh repo create YOUR_ORG/visriva-web --public --source=. --remote=origin --push
```

## Cloudflare (optional)

Point the domain to Vercel (CNAME to `cname.vercel-dns.com` or A records per Vercel docs), enable the orange-cloud proxy, and add page rules or Cache Rules as needed; static assets on Vercel are already edge-cached.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server locally |
| `npm run lint` | ESLint |

## License

Private — Visriva. All rights reserved.
