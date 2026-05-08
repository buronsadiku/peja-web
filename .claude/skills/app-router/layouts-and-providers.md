---
name: layouts-and-providers
description: Use this skill when building App Router layouts with nested providers, server/client split, auth guards, and async params in Next.js 16
type: skill
---

# Layouts and Provider Architecture (Next.js 16)

## When to Use
- Creating layout components with providers (auth, i18n, theme, state)
- Splitting server-side data fetching from client-side provider wrappers
- Implementing auth guards at the layout level

## Core Principles
- **Root layout** (`app/layout.tsx`) is minimal — metadata + children passthrough
- **Locale layout** (`app/[locale]/layout.tsx`) is the real app shell — html, body, providers
- Client providers are a **separate component** rendered inside the server layout
- Auth checks happen in layouts, not in individual pages
- `params` is `Promise<T>` in all layouts — must await

## Code Templates

### Root layout (minimal passthrough)

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'App Name',
  description: 'App description',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
```

### Locale layout (app shell)

```typescript
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### Route group layout (simple wrapper)

```typescript
// src/app/[locale]/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
```

### Protected layout with auth guard

```typescript
// src/app/[locale]/(app)/layout.tsx
import { redirect } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/auth/session'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/sign-in')
  }

  return (
    <>
      {/* Sidebar, top bar, etc. */}
      <main className="flex-1">{children}</main>
    </>
  )
}
```

### Nested dynamic layout with async params

```typescript
// src/app/[locale]/(app)/events/[eventId]/layout.tsx
export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string; eventId: string }>
}) {
  const { eventId } = await params
  // Fetch event data, validate access, etc.

  return (
    <>
      {/* Event context header, tab navigation */}
      <main className="flex-1">{children}</main>
    </>
  )
}
```

### Client providers wrapper (add when needed)

```typescript
// src/features/layout/AppProviders.tsx
'use client'

import type { ReactNode } from 'react'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Theme, error boundary, toast, etc. */}
      {children}
    </>
  )
}
```

### Deduplicating server-side data fetches with React.cache()

When both a layout and its child page need the same data (e.g., current user), use `React.cache()` to deduplicate:

```typescript
// src/lib/auth/session.ts
import { cache } from 'react'
import { cookies } from 'next/headers'

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) return null
  // fetch user...
})
```

Now `getCurrentUser()` called in both layout and page only makes one request per render pass.

### Dark mode script (no flash — add when implementing theme toggle)

```typescript
// src/features/layout/ThemeScript.tsx
export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){
          var t=localStorage.getItem('theme');
          if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))
            document.documentElement.classList.add('dark');
        })()`,
      }}
    />
  )
}
```

## Provider Nesting Order

```
html
  body
    NextIntlClientProvider (i18n — outermost, rarely changes)
      ThemeProvider (dark mode — changes rarely)
        ErrorBoundary (catch rendering errors)
          {page content}
        Toaster (notifications — rendered outside page flow)
```

## Server/Client Boundary Rules
- Layouts that **fetch data** or **check auth** are `async` server components
- Provider wrappers that use hooks, state, or context are `'use client'`
- Server data crosses the boundary via **props only**
- Never import `next/headers` in `'use client'` files

## Conventions
- Root layout: passthrough, metadata, globals.css import
- Locale layout: html, body, `NextIntlClientProvider`, `generateStaticParams`
- `params` is `Promise<T>` — always `await` in async layouts
- `suppressHydrationWarning` on `<html>` when using theme script
- Auth guard in layout = redirect before page renders

## Anti-patterns
- Never fetch data in client providers — fetch in server layout, pass as props
- Never put `'use client'` on layout files that need auth checks
- Never destructure params synchronously — always await
- Never wrap the entire app in a single massive provider — split by concern
