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

Apply the SQL migrations in `supabase/migrations/` before expecting database-backed features to work.

## Visual editing (local only)

Visriva includes a small, original visual-editing proxy for local development. It is separate from the Website CMS:

- The CMS remains the place to edit and publish page content and SEO fields.
- The visual editor lets you select page elements, preview text edits, and queue duplicate/delete proposals while working locally.
- Saving creates review items in `.visriva-live/pending.json`; it does **not** write application source files, update Supabase, or change the public website.
- Structural and text proposals must be reviewed and implemented in the source by a developer or coding agent, then tested and committed normally.
- The proxy binds to `127.0.0.1` only and refuses non-local upstream targets. Do not expose it through a public tunnel or deploy it to Vercel.

Start the Next.js dev server in one terminal:

```bash
npm run dev
```

Start the visual editor in a second terminal:

```bash
npm run live
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321). Click an element, choose **Edit text**, **Duplicate**, or **Delete**, then choose **Save draft**. Toggle **Select** off when you need to interact with the page normally.

Inspect the saved proposals:

```bash
npm run live:pending
```

After the proposals have been implemented and reviewed, remove them by ID:

```bash
npm run live:done -- <proposal-id>
```

Or clear the queue after confirming it is resolved:

```bash
npm run live:done
```

The local queue folder is ignored by Git. No additional npm dependencies or environment variables are required.

## Deploy on Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com): import the GitHub repo with the Next.js framework preset.
3. Add the production and preview environment variables in **Project → Settings → Environment Variables**.
4. Deploy the approved `main` branch.

The visual editor is a development-only utility; it is not part of the deployed production application.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server locally |
| `npm run lint` | ESLint |
| `npm run live` | Local visual-editing proxy (requires `npm run dev`) |
| `npm run live:pending` | List saved visual-edit proposals |
| `npm run live:done -- <id>` | Remove a resolved proposal by ID |

## License

Private — Visriva. All rights reserved.
