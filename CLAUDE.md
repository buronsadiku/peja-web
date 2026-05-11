# peja-web

Next.js 16 frontend for the **Peja Outdoor Festival** + admin dashboard. Public pages fetch from `peja-api`. Admin lives under `/admin` (Better Auth) and writes directly to the shared Postgres via Drizzle.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind v4 (`@theme inline` in `src/app/globals.css`)
- Better Auth (drizzle adapter, email+password)
- TanStack Query (data fetching + cache)
- next-intl 4 (en + sq locales)
- react-day-picker 9 (festival days calendar)
- Lucide icons
- AWS SDK v3 (S3-compatible — MinIO local, R2 prod)
- Drizzle ORM + node-postgres (shared DB with peja-api)
- pnpm workspaces (`packages/ui|icons|illustrations` mostly empty scaffolds)

## Architecture

```
Browser ──── /pages           Next.js renders, fetches via api client → peja-api :3001
        ──── /admin/*         Next.js renders, fetches via /api/admin/*
        ──── /api/admin/*     Route handlers → Better Auth check → Drizzle direct to Postgres
        ──── /api/auth/*      Better Auth handler (sign-in / sign-out / sessions)

DB (shared):
  ┌─ peja-api reads
  ├─ peja-web admin reads + writes
  └─ Better Auth (user / session / account / verification)
```

**Why direct DB writes from peja-web admin?** Admin auth + auditing in one process. peja-api stays a simple read-only public service. Trade-off: schema duplicated in both repos (`src/lib/db/schema/` mirrors `peja-api/src/database/schema/`). When you change a table, update both, then run migration via peja-api.

## Public routes

| Path | Page |
|---|---|
| `/{locale}/` | Home (hero + countdown + quick info + headliners + memories + sponsors + CTA) |
| `/{locale}/activities` | List with category + day filter, Cards or Timeline (Gantt) view |
| `/{locale}/activities/[slug]` | Detail page: cover hero, gallery, schedule per occurrence with embed map, register CTA |
| `/{locale}/gallery` | Infinite-scroll grid with section filter chips, lightbox on click |
| `/{locale}/news` | Paginated news list (pinned first) |
| `/{locale}/news/[slug]` | News post detail |
| `/{locale}/register` | Multi-step form: day → personal info → activities → terms |

`{locale}` is `en` (default) or `sq` (Albanian). Locale prefix is "as-needed" — English URLs work without `/en/`.

## Admin routes

Outside locale routing (single language). Cookie `peja.session_token` required for everything except `/admin/login`. `proxy.ts` redirects unauthorized → login.

| Path | Page |
|---|---|
| `/admin/login` | Better Auth sign-in form |
| `/admin/festival-days` | Calendar picker (click days to toggle) + list with label/order edit |
| `/admin/activities` | Templates with nested occurrence editor (date dropdown, time, capacity, address, lat/lng) |
| `/admin/gallery` | Infinite-scroll grid by section, single + bulk image upload via MinIO |
| `/admin/news` | Posts CRUD (title, body, slug, image URL, pinned toggle) |
| `/admin/sponsors` | Sponsor logo upload + tier + URL CRUD |
| `/admin/registrations` | Paginated table, search + day + activity filter, inline edit, delete |

## API route handlers (admin write path)

`/api/auth/[...all]` — Better Auth catch-all.

`/api/admin/*` — All require valid session (`requireAdminApi` helper):

```
activities/                CRUD activity_templates
activities/[id]
occurrences/               CRUD activity_occurrences
occurrences/[id]
activity-images/           CRUD activity_images (cover toggle clears other covers in tx)
activity-images/[id]
activity-images/upload     POST multipart → MinIO PUT → return publicUrl
festival-days/             CRUD festival_days
festival-days/[id]
gallery/                   CRUD gallery_images (paginated, section filter)
gallery/[id]
gallery/upload             POST multipart → MinIO
news/                      CRUD news_posts
news/[id]
sponsors/                  CRUD sponsors
sponsors/[id]
registrations/             GET paginated + search + occurrenceId + festivalDayId filters
registrations/[id]         PATCH (edit) / DELETE
```

## Folder structure

```
src/
  app/
    layout.tsx                          root: <html>/<body>/metadata
    [locale]/
      layout.tsx                        fonts + theme init + Providers + nav + footer
      page.tsx → HomePage
      activities/page.tsx → ActivitiesPage
      activities/[slug]/page.tsx → ActivityDetailPage
      gallery/page.tsx → GalleryPage
      news/page.tsx → NewsPage
      news/[slug]/page.tsx → NewsDetailPage
      register/page.tsx → RegisterPage
      not-found.tsx
    admin/
      layout.tsx                        admin root (html/body, no locale)
      login/page.tsx
      (dashboard)/
        layout.tsx                      sidebar + Providers + requireAdmin guard
        page.tsx                        → redirect /admin/activities
        festival-days/page.tsx
        activities/page.tsx
        gallery/page.tsx
        news/page.tsx
        sponsors/page.tsx
        registrations/page.tsx
    api/auth/[...all]/route.ts          Better Auth catch-all
    api/admin/**/route.ts               admin CRUD
  features/                             one folder per feature (page-scoped components + logic)
    layout/                             SiteNav, SiteFooter, Providers, ThemeToggle, LocaleSwitcher
    marketing/                          home page sections
    activities/                         public activities + detail + timeline + map
    gallery/                            public gallery + lightbox
    news/                               public news list + detail
    register/                           register form, conflict detection
    admin/
      Sidebar.tsx
      components/                       Pagination
      activities/AdminActivitiesPage.tsx
      festival-days/AdminFestivalDaysPage.tsx
      gallery/AdminGalleryPage.tsx
      news/AdminNewsPage.tsx
      sponsors/AdminSponsorsPage.tsx
      registrations/AdminRegistrationsPage.tsx
      lib/admin-api.ts                  client for /api/admin/*
      lib/news-api.ts                   news + sponsors admin client
  i18n/                                 next-intl config + navigation
  lib/
    api/client.ts                       public API client (calls peja-api)
    api/types.ts                        shared response types
    auth/config.ts                      Better Auth server setup
    auth/client.ts                      Better Auth client (signIn/signOut/useSession)
    auth/server.ts                      getSession + requireAdmin (server)
    auth/api-guard.ts                   requireAdminApi (route handlers)
    db/client.ts                        Drizzle client (server-only)
    db/schema/                          duplicated schema files from peja-api
    storage/s3.ts                       S3 client (MinIO local / R2 prod)
  proxy.ts                              middleware: next-intl + admin gate
messages/                               en.json, sq.json
.claude/skills/                         project skills (read before writing code!)
AGENTS.md                               code style + Next.js 16 rules
```

## Conventions

- Pages re-export the feature component (per skill rule: `page.tsx` = single re-export line, no JSX, no logic).
- **Functional components only**, arrow functions.
- One component per file.
- No inline JSX inside `.map()` — extract a named component.
- Theme tokens (e.g. `bg-background`, `text-foreground`, `bg-primary`) — not raw colors (`text-white`, `bg-black`). The hero is the main exception (uses tokens for light-mode adaptation).
- Slug naming: lowercase, hyphens (`^[a-z0-9-]+$`).
- Time fields stored as `HH:MM:SS`; form inputs use `<input type="time">` (`HH:MM`) and frontend appends `:00`.
- Date fields stored as `YYYY-MM-DD`; form inputs use `<input type="date">`.

## Required env

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
DATABASE_URL=postgresql://peja:peja@localhost:5432/peja        # SAME db as peja-api
AUTH_COOKIE_SECRET=<must match peja-api>
AUTH_HASH_PEPPER=<random 32+ bytes>
TRUSTED_ORIGINS=http://localhost:3000
COOKIE_DOMAIN=                                                  # set to .peja.fest in prod
OBJECT_STORAGE_ENDPOINT=http://localhost:9000
OBJECT_STORAGE_ACCESS_KEY=minioadmin
OBJECT_STORAGE_SECRET_KEY=minioadmin
OBJECT_STORAGE_BUCKET=peja-uploads
OBJECT_STORAGE_PUBLIC_DOMAIN=http://localhost:9000/peja-uploads
```

## Local dev

```bash
cp .env.example .env
pnpm install
pnpm dev
```

Visit `http://localhost:3000`. Admin at `/admin/login` (create user via curl, see peja-api CLAUDE.md).

## Theme

CSS variables in `src/app/globals.css`. `:root` = dark theme (default), `:root.light` = light theme. `ThemeToggle` writes `peja-theme` to localStorage; layout has inline script that applies the class before paint to avoid flash.

## Storage

Single MinIO bucket `peja-uploads` with `public/` prefix anonymously readable. Subfolders by type:
- `public/gallery/<uuid>-<filename>` — public gallery
- `public/activities/<uuid>-<filename>` — activity template images

Production: swap env to Cloudflare R2 with custom domain.

## Festival flow at a glance

1. Admin creates `festival_days` via calendar (`/admin/festival-days`)
2. Admin creates `activity_templates` and adds `activity_occurrences` per day with capacity + map coords (`/admin/activities`)
3. Public visits `/activities` → fetches occurrences via `peja-api`
4. User opens activity detail at `/activities/<slug>` → sees gallery, schedule, map
5. User registers at `/register` — picks day → form validates overlap + capacity → POST to `peja-api/v1/registrations`
6. Admin views/edits/deletes registrations at `/admin/registrations`
7. Live updates posted via `/admin/news`, public views at `/news`

## Production swap

| Concern | Local | Prod |
|---|---|---|
| Web host | `pnpm dev` :3000 | Netlify (config in `netlify.toml`) |
| API URL | `:3001` | `https://api.peja.fest` (set `NEXT_PUBLIC_API_URL`) |
| Postgres | docker | Neon/Railway (shared with peja-api) |
| Object storage | MinIO | Cloudflare R2 (custom domain for `OBJECT_STORAGE_PUBLIC_DOMAIN`) |
| Better Auth | dev signup open | set `NODE_ENV=production` → signup blocked |
| Cookie | host-only `localhost` | `COOKIE_DOMAIN=.peja.fest` so API + web share |

⚠️ **Cross-project isolation**: separate R2 bucket + DB + Resend domain from Ovation (or any other project sharing infra).
