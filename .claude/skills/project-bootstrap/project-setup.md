---
name: project-setup
description: Use this skill when setting up or understanding the Next.js 16 project structure — file organization, packages, path aliases, and build config
type: skill
---

# Project Setup (Next.js 16)

## When to Use
- Understanding the project's directory structure and conventions
- Adding new top-level directories or modules
- Configuring TypeScript, ESLint, or build settings

## Core Principles
- `src/` contains all application code
- `packages/ui/` contains reusable UI components (`@peja/ui`)
- `packages/icons/` contains SVG icon components (`@peja/icons`)
- Features are self-contained modules in `src/features/`
- Shared utilities live in `src/lib/`
- **Turbopack is the default** bundler in Next.js 16
- **NEVER use raw Tailwind colors** — always theme tokens
- **NEVER add code comments** — variable and function names should be descriptive enough

## Project Structure

```
<PROJECT_ROOT>/
├── packages/
│   ├── ui/                     # @peja/ui — shadcn/ui components
│   │   ├── src/
│   │   │   ├── components/     # Button, Input, Dialog, etc.
│   │   │   └── utils/          # cn() utility
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── icons/                  # @peja/icons — SVG icon components
│   │   ├── src/                # One file per icon, individual exports
│   │   │   ├── ChevronDown.tsx
│   │   │   ├── Check.tsx
│   │   │   └── ...
│   │   └── package.json
│   │
│   └── illustrations/          # @peja/illustrations — larger SVG illustrations
│       ├── src/                # One file per illustration
│       └── package.json
│
├── src/
│   ├── app/                    # App Router routes
│   │   ├── layout.tsx          # Root layout (metadata, globals.css)
│   │   ├── globals.css         # Tailwind v4 + shadcn theme tokens (oklch)
│   │   └── [locale]/           # Locale-wrapped routes
│   │       ├── layout.tsx      # Locale layout (html, body, providers)
│   │       ├── (marketing)/    # Public pages
│   │       ├── (auth)/         # Auth pages
│   │       ├── (app)/          # Protected app
│   │       ├── g/              # Guest submission
│   │       ├── checkout/       # Purchase flow
│   │       └── kiosk/          # Fullscreen kiosk
│   │
│   ├── features/               # Feature modules (self-contained)
│   │   ├── layout/             # Layout components
│   │   ├── marketing/          # Marketing page components
│   │   └── domain/             # Domain types and logic
│   │
│   ├── lib/                    # Shared utilities and services
│   │   ├── api/                # API client, service modules
│   │   ├── auth/               # Auth helpers, session
│   │   ├── hooks/              # Shared React hooks
│   │   ├── utils/              # Pure utility functions (env, etc.)
│   │   ├── kiosk/              # Kiosk-specific logic
│   │   └── media/              # Media handling (audio/photo)
│   │
│   ├── i18n/                   # Internationalization config
│   │   ├── config.ts           # Locales, currencies, BCP 47 tags
│   │   ├── routing.ts          # defineRouting
│   │   ├── navigation.ts       # createNavigation exports
│   │   ├── request.ts          # Message loading
│   │   └── currency.ts         # CLDR currency formatting
│   │
│   ├── styles/                 # Additional stylesheets
│   └── proxy.ts                # Next.js 16 proxy (replaces middleware)
│
├── messages/                   # i18n JSON translation files
├── public/                     # Static assets
├── next.config.ts              # Next.js config + next-intl plugin
├── postcss.config.mjs          # Tailwind v4 PostCSS plugin
├── eslint.config.mjs           # ESLint flat config
├── tsconfig.json               # TypeScript config
├── pnpm-workspace.yaml         # Workspace: packages/*
└── package.json
```

## What Goes Where

| Location | Contains | Rule |
|----------|----------|------|
| `packages/ui/` | UI primitives | shadcn/ui components, cn() — `@peja/ui` |
| `packages/icons/` | Icon components | One SVG component per file — `@peja/icons` |
| `packages/illustrations/` | SVG illustrations | Larger decorative/complex SVGs — `@peja/illustrations` |
| `src/app/` | Route files only | Thin shells that import from features |
| `src/features/` | Feature modules | Components, stores, types, schemas per feature |
| `src/lib/` | Shared code | API client, auth, hooks, utilities |
| `src/i18n/` | i18n config | Routing, navigation, translations, currency |
| `messages/` | Translation JSON | One file per locale |

**Decision test:** UI primitive? → `packages/ui/`. Icon? → `packages/icons/`. Feature-specific? → `src/features/<name>/`. Shared across features? → `src/lib/`.

## Icons Package

```
packages/icons/
├── src/
│   ├── ChevronDown.tsx         # One file per icon
│   ├── Check.tsx
│   ├── X.tsx
│   └── ...
└── package.json                # @peja/icons
```

```typescript
// packages/icons/src/ChevronDown.tsx
export function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
```

Import individually — never barrel import:
```typescript
import { ChevronDown } from '@peja/icons/ChevronDown'
import { Check } from '@peja/icons/Check'
```

## TypeScript Config

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "strict": true,
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

Single path alias: `@/*` → `./src/*`. Import examples:
- `@/features/auth/LoginForm`
- `@/lib/api/client`
- `@/i18n/navigation`

Package imports use the package name:
- `@peja/ui/components/Button`
- `@peja/icons/ChevronDown`

## Next.js Config

```typescript
// next.config.ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
const nextConfig: NextConfig = {
  transpilePackages: ['@peja/ui', '@peja/icons'],
}
export default withNextIntl(nextConfig)
```

## Key Next.js 16 Differences
- **Turbopack default** — no webpack config needed, opt in with `next build --webpack`
- **`proxy.ts` replaces `middleware.ts`** — runs on Node.js, not Edge
- **`params` is `Promise<T>`** — must `await` in all server components
- **`cookies()` and `headers()` are async** — must `await`
- **`next lint` removed** — use ESLint CLI directly: `npx eslint .`
- **Fetch not cached by default** — must opt in with `cache: 'force-cache'`

## Code Style
- **No code comments** — variable names, function names, and types should be self-documenting
- Names should be descriptive but not excessively long
- If logic isn't clear from the code, refactor it — don't explain it with a comment

## Conventions
- Feature modules are self-contained: components + types + schemas + store
- Shared hooks in `src/lib/hooks/`, not scattered across features
- One `@/*` path alias for everything — no per-directory aliases
- Environment variables via `process.env` — `NEXT_PUBLIC_` prefix for client access

## Anti-patterns
- Never put UI primitives in `src/` — they belong in `packages/ui/`
- Never barrel-export icons — import individually for tree-shaking
- Never create a `tailwind.config.ts` — Tailwind v4 uses CSS config
- Never name proxy file `middleware.ts` — Next.js 16 uses `proxy.ts`
- Never use raw Tailwind colors (`text-zinc-50`, `bg-slate-900`) — use theme tokens
- Never add code comments — write self-documenting code instead
- Never use webpack-specific config without `--webpack` flag
