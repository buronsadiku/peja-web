---
name: route-structure
description: Use this skill when organizing Next.js 16 App Router routes with route groups, dynamic segments, async params, and layout nesting
type: skill
---

# App Router Route Structure (Next.js 16)

## When to Use
- Setting up route organization for an App Router project
- Adding route groups to support multiple layout variants
- Implementing dynamic segments with async `params`

## Core Principles
- **Route groups** `(name)` control which layout wraps a set of pages — they don't affect URLs
- **Pages are pure re-exports** — a `page.tsx` contains ONLY a single re-export line: `export { ComponentName as default } from "@/features/..."`, zero imports, zero logic, zero JSX
- **One `[locale]` segment** at the root wraps all routes for i18n
- **`params` is always a Promise** in Next.js 16 — must `await` in async components or `use()` in client components

## Route Structure

```
src/app/
├── layout.tsx                              # Root layout (metadata, globals.css import)
├── globals.css                             # Tailwind v4 + CSS variables
├── [locale]/
│   ├── layout.tsx                          # Locale layout (html, body, NextIntlClientProvider)
│   ├── not-found.tsx                       # 404 page
│   │
│   ├── (marketing)/                        # Public pages (header + footer)
│   │   ├── layout.tsx
│   │   ├── page.tsx                        # Landing page
│   │   ├── about/page.tsx
│   │   ├── how-it-works/page.tsx
│   │   ├── examples/page.tsx
│   │   ├── pricing/page.tsx
│   │   └── legal/
│   │       ├── privacy/page.tsx
│   │       ├── terms/page.tsx
│   │       └── cookies/page.tsx
│   │
│   ├── (auth)/                             # Auth pages (centered, minimal)
│   │   ├── layout.tsx
│   │   ├── sign-in/page.tsx
│   │   ├── sign-up/page.tsx
│   │   ├── verify-email/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   │
│   ├── (app)/                              # Protected app (sidebar + nav)
│   │   ├── layout.tsx                      # Auth guard at layout level
│   │   ├── page.tsx                        # Dashboard / event list
│   │   ├── account/page.tsx
│   │   ├── events/new/page.tsx
│   │   └── events/[eventId]/
│   │       ├── layout.tsx                  # Event context header + tab nav
│   │       ├── page.tsx
│   │       ├── messages/
│   │       │   ├── page.tsx
│   │       │   └── [messageId]/page.tsx
│   │       ├── photos/page.tsx
│   │       ├── invite/page.tsx
│   │       ├── kiosk/page.tsx
│   │       ├── keepsakes/
│   │       │   ├── page.tsx
│   │       │   └── [product]/configure/page.tsx
│   │       ├── orders/
│   │       │   ├── page.tsx
│   │       │   └── [orderId]/page.tsx
│   │       ├── pricing/page.tsx
│   │       ├── settings/page.tsx
│   │       └── checklist/page.tsx
│   │
│   ├── g/                                  # Guest submission (minimal chrome)
│   │   ├── layout.tsx
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       ├── record/page.tsx
│   │       └── thank-you/page.tsx
│   │
│   ├── checkout/                           # Purchase flow
│   │   ├── layout.tsx
│   │   └── [orderId]/
│   │       ├── page.tsx
│   │       ├── success/page.tsx
│   │       └── cancel/page.tsx
│   │
│   └── kiosk/                              # Fullscreen kiosk mode
│       ├── layout.tsx
│       └── [eventId]/page.tsx
│
└── api/                                    # Route handlers (outside [locale])
    └── webhooks/stripe/route.ts
```

## Code Templates

### Async params (Next.js 16 — all params are Promises)

```typescript
// Server component — await params
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; eventId: string }>
}) {
  const { locale, eventId } = await params
  // ...
}

// Client component — use React.use()
'use client'
import { use } from 'react'

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  // ...
}
```

### Page files (STRICT — pure re-export only)

Every `page.tsx` must contain exactly ONE line — a re-export from `@/features/`:

```typescript
// src/app/[locale]/(marketing)/about/page.tsx
export { AboutPage as default } from "@/features/marketing/AboutPage";
```

```typescript
// src/app/[locale]/(auth)/sign-in/page.tsx
export { SignInPage as default } from "@/features/auth/SignInPage";
```

```typescript
// src/app/[locale]/(app)/app/page.tsx
export { DashboardHome as default } from "@/features/dashboard/DashboardHome";
```

No imports, no component definitions, no props, no logic. All component code lives in `src/features/`.

If a page needs `params`, `searchParams`, or `generateMetadata`, handle that inside the feature component — the page.tsx stays a one-liner.

### Catch-all for 404

```typescript
// src/app/[locale]/[...catchAll]/page.tsx
import { notFound } from 'next/navigation'
export default function CatchAll() {
  notFound()
}
```

### Route handler

```typescript
// src/app/api/webhooks/stripe/route.ts
export { stripeWebhookHandler as POST } from '@/lib/api/webhooks/stripe'
```

## Layout Nesting

```
app/layout.tsx (Root — metadata, globals.css)
  [locale]/layout.tsx (Locale — html, body, NextIntlClientProvider)
    ├── (marketing)/layout.tsx (Header, footer)
    ├── (auth)/layout.tsx (Centered card, minimal)
    ├── (app)/layout.tsx (Sidebar, auth guard)
    │   └── events/[eventId]/layout.tsx (Event context, tab nav)
    ├── g/layout.tsx (Guest — minimal, event-themed)
    ├── checkout/layout.tsx (Progress bar, minimal)
    └── kiosk/layout.tsx (Fullscreen, no chrome)
```

## Conventions
- Route group names describe layout purpose, not URL path
- `page.tsx` files are pure re-exports: `export { X as default } from "@/features/..."` — no imports, no logic, no JSX
- `dynamic = 'force-static'` on marketing pages
- API route handlers live outside `[locale]`
- `params` is always `Promise<T>` — `await` in server, `use()` in client

## Anti-patterns
- Never put ANY code in `page.tsx` beyond a single re-export line — all logic lives in `@/features/`
- Never destructure params synchronously — always await or use()
- Never nest route groups more than 2 levels deep
- Never put route handlers inside `[locale]` — API routes don't need i18n
