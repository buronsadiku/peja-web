# peja-web

Next.js 16 app for Peja. Hosts the Better Auth handler, all customer
UI, and the guest landing/record flows. Talks to `peja-api` over
HTTP using a session cookie.

## Architecture in one paragraph

Better Auth lives at `/api/auth/[...all]` in this app and owns the
entire auth lifecycle: email/password, Google + Apple OAuth, email
verification, password reset, session creation, revocation. Sessions
are stored in the same Postgres the API uses. Browser-side `clientFetch`
calls `${NEXT_PUBLIC_API_URL}/api/v1/...` directly with
`credentials: 'include'`; the cookie is signed with `AUTH_COOKIE_SECRET`
and the API verifies the HMAC. State-changing requests automatically
attach `X-CSRF-Token`. There is no proxy and no JWT.

## Stack

- Next.js 16 (App Router) on React 19
- Tailwind v4 (`@theme inline` in CSS, no config file)
- next-intl v4 (en, fr, nl, de, es, it)
- Better Auth 1.6 + `pg` for direct Postgres
- TanStack Query 5
- React Hook Form + zod (standard-schema resolver)
- Resend for transactional email
- Sentry, PostHog (optional)

## Local development

Requires `peja-api` running, plus its docker stack (Postgres +
Redis + MinIO).

```bash
# 1. From peja-api/, bring infra up and run the API
cd ../peja-api
docker compose up -d
pnpm db:migrate
pnpm start:dev   # leave running on :3001

# 2. Configure peja-web env
cd ../peja-web
cp .env.example .env.local
# Use the same AUTH_COOKIE_SECRET / AUTH_HASH_PEPPER values you set in
# peja-api/.env. They must match.

# 3. Install + run
pnpm install
pnpm dev
```

App on `http://localhost:3000`. The API must be on `http://localhost:3001`
so the browser can hit it directly with the session cookie.

## Useful commands

| Command | What it does |
|---|---|
| `pnpm dev` | Next dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run production build |
| `pnpm ts-check` | `tsc --noEmit` |
| `pnpm lint` | ESLint (use the CLI directly; `next lint` is gone in 16) |
| `pnpm format` | Prettier write |

## Project layout

```
src/
├── app/                # App Router routes
│   ├── [locale]/       # all customer + guest pages, locale-prefixed
│   └── api/auth/[...all]/   # Better Auth handler — only auth route here
├── features/           # one folder per feature, server + client components
│   ├── auth/           # sign-in, sign-up flow, password reset
│   ├── dashboard/
│   ├── messages/
│   ├── photos/
│   ├── guests/
│   ├── keepsakes/
│   ├── kiosk-setup/
│   ├── settings/
│   └── guest/          # public guest landing + recorder
├── lib/
│   ├── auth/           # Better Auth config, client, session helpers
│   ├── api/            # clientFetch / apiFetch + per-domain wrappers
│   ├── query/          # TanStack Query hooks + keys
│   ├── hooks/          # useFullscreen, useWakeLock, useIdleTimeout
│   └── utils/          # env, formatting, etc.
├── i18n/               # next-intl config
└── proxy.ts            # locale-aware route guarding (Next.js 16 replaces middleware.ts)
```

`messages/<locale>.json` holds the frontend translation strings. The
backend has its own translations under `peja-api/src/common/i18n`.

## Env

Full list in `.env.example`. The non-obvious ones:

- **`AUTH_COOKIE_SECRET`** — must match `peja-api`'s
  `AUTH_COOKIE_SECRET`. Better Auth signs the cookie with it on this
  side; the API verifies on the other.
- **`AUTH_HASH_PEPPER`** — independent secret used to hash IP/UA before
  storing on `session` rows.
- **`COOKIE_DOMAIN`** — leave empty in dev (`localhost` rejects
  `Domain` cookies). Set to `.peja.app` in prod so `app.*` and
  `api.*` share the cookie.
- **`TRUSTED_ORIGINS`** — comma-separated origins Better Auth accepts
  for CSRF + redirects.
- **`DATABASE_URL`** — Better Auth needs direct Postgres access.

## Deploy (Railway)

- Service "peja-web" deploys from this directory
- Set the same `AUTH_*` secrets the API uses
- Set `DATABASE_URL=${{ Postgres.DATABASE_URL }}` (same Postgres as API)
- Set `COOKIE_DOMAIN=.peja.app`
- Set `TRUSTED_ORIGINS=https://app.peja.app,https://peja.app`
- Set `NEXT_PUBLIC_API_URL=https://api.peja.app`
- DNS: `app.peja.app` → this service. The API service must be at
  `api.peja.app` for the cross-subdomain cookie to flow.

## House rules

These come from `AGENTS.md` and matter when editing UI:

- One component per file. When a component grows sub-components,
  extract them as siblings.
- No raw Tailwind colors (`bg-slate-*`) — use theme tokens
  (`bg-card`, `text-foreground`).
- No raw text sizes (`text-sm`) — use `type-*` utilities (`type-body`,
  `type-caption`).
- No raw radii (`rounded-lg`) — numeric tokens (`rounded-12`,
  `rounded-16`).
- No default breakpoints (`md:`, `lg:`) — named (`tablet:`, `desktop:`).
- Inline SVGs go to `packages/icons/` or `packages/illustrations/`,
  never embedded in components.
- All user-facing strings go through `useTranslations()` /
  `getTranslations()`.

`pnpm dev` and a quick browser sanity-check are mandatory before
calling a UI change done.

## Things to know

- Better Auth's catch-all is the only `/api/auth` route here.
  Old Supabase routes (`/signin`, `/refresh`, etc.) are gone.
- Server components fetch via `apiFetch` (forwards the cookie header
  + locale). Client components fetch via `clientFetch` (uses
  `credentials: 'include'` and auto-attaches CSRF).
- `useSession()` from `@/lib/auth/client` is the source of truth for
  signed-in state on the client. Server components use
  `getCurrentUser()` from `@/lib/auth/session`.
- Locale comes from the URL prefix (`/fr/...`, `/de/...`). Default
  locale (`en`) has no prefix.
