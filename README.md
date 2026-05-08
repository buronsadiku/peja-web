# peja-web

Next.js 16 frontend for Peja.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind v4 (`@theme inline` in `src/app/globals.css`)
- shadcn/ui
- next-intl 4 (locale routing)
- TanStack Query
- Zustand
- React Hook Form + Zod
- pnpm workspaces (`packages/ui`, `packages/icons`, `packages/illustrations`)

## Local setup

```bash
cp .env.example .env
pnpm install
pnpm dev
```

App runs on `http://localhost:3000`.

## Scripts

- `pnpm dev` — Next dev server (Turbopack)
- `pnpm build` — production build
- `pnpm start` — production server
- `pnpm lint` — eslint
- `pnpm format` — prettier write
- `pnpm ts-check` — typecheck

## Layout

```
src/
  app/                 App Router (root + [locale])
  i18n/                next-intl config + routing
  proxy.ts             next-intl middleware (replaces middleware.ts in Next 16)
packages/
  ui/                  @peja/ui — shared components
  icons/               @peja/icons — icon components
  illustrations/       @peja/illustrations — illustrations
messages/              i18n translations (en.json)
.claude/skills/        project skills (read these before writing code)
AGENTS.md              code style + Next.js 16 rules
```

Read `AGENTS.md` and the relevant skill in `.claude/skills/` before writing code.
