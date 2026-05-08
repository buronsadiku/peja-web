---
name: proxy-auth
description: Use this skill when implementing auth guards in Next.js 16 — proxy.ts (replaces middleware), async cookies/headers, route protection, token refresh, and dual auth strategy
type: skill
---

# Proxy and Auth (Next.js 16)

## When to Use
- Setting up `proxy.ts` for route protection and auth
- Implementing server-side JWT token handling with async cookies
- Combining auth guards with next-intl locale routing
- Protecting routes at both proxy and layout level

## Core Principles
- **Next.js 16 uses `proxy.ts`, not `middleware.ts`** — same concept, new name
- Proxy runs on **Node.js runtime** (not Edge) in Next.js 16
- **`cookies()` and `headers()` are async** — must `await`
- Auth check = read JWT from cookie, verify expiry, optionally refresh
- Dual protection: proxy for initial request, layout for component-level

## Code Templates

### Proxy with auth + i18n

```typescript
// src/proxy.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const PROTECTED_ROUTES = ['/app', '/events', '/account']
const AUTH_ROUTES = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password']

export function proxy(request: Request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  // Strip locale prefix for route matching
  const pathnameWithoutLocale = stripLocalePrefix(pathname)

  // Get auth token from cookie header
  const cookieHeader = request.headers.get('cookie') ?? ''
  const token = parseCookie(cookieHeader, 'auth_token')
  const isAuthenticated = token && !isTokenExpired(token)

  // Protect app routes
  if (isProtectedRoute(pathnameWithoutLocale) && !isAuthenticated) {
    const loginUrl = new URL('/sign-in', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return Response.redirect(loginUrl)
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute(pathnameWithoutLocale) && isAuthenticated) {
    return Response.redirect(new URL('/app', request.url))
  }

  return intlMiddleware(request as any)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}

// --- Helpers ---

function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split('/')
  const possibleLocale = segments[1]
  if (possibleLocale && possibleLocale.length === 2) {
    return '/' + segments.slice(2).join('/')
  }
  return pathname
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route))
}

function parseCookie(header: string, name: string): string | null {
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match?.[1] ?? null
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}
```

**Note:** JWT parsing via `atob` is intentionally lightweight — proxy must be fast. Full signature verification happens server-side in layout auth guards.

### Cookie Access Patterns

| Context | How to read cookies |
|---------|-------------------|
| `proxy.ts` | Parse from `request.headers.get('cookie')` — no `next/headers` available |
| Server component / layout | `const store = await cookies()` from `next/headers` |
| Route handler | `const store = await cookies()` from `next/headers` |
| Client component | `document.cookie` or a cookie utility library |

### Layout-level auth guard (second layer)

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
      {/* Sidebar, top bar */}
      <main className="flex-1">{children}</main>
    </>
  )
}
```

### Auth service (server-only, async cookies)

```typescript
// src/lib/auth/session.ts
import { cookies } from 'next/headers'

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value ?? null
}

export async function getCurrentUser(): Promise<User | null> {
  const token = await getAuthToken()
  if (!token) return null

  try {
    const res = await fetch(`${process.env.API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}
```

### Login handler (client-side)

```typescript
// src/features/auth/useLogin.ts
'use client'
import { useRouter } from '@/i18n/navigation'

export function useLogin() {
  const router = useRouter()

  const login = async (credentials: { email: string; password: string }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    const { accessToken } = await res.json()
    document.cookie = `auth_token=${accessToken}; max-age=${7 * 24 * 60 * 60}; path=/`
    router.replace('/app')
  }

  return { login }
}
```

## Dual Protection Strategy

| Layer | Protects Against | Mechanism |
|-------|-----------------|-----------|
| Proxy | Direct URL access, expired tokens | Cookie check + redirect |
| Layout | Component rendering without auth | `getCurrentUser()` + redirect |

Both layers needed: proxy can't run heavy auth checks, layouts don't intercept URL navigation fast enough.

## Key Next.js 16 Differences
- `proxy.ts` replaces `middleware.ts`
- Proxy runs on **Node.js** (not Edge) — more APIs available
- `cookies()` is async — `const store = await cookies()`
- `headers()` is async — `const hdrs = await headers()`
- Config key `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`

## Conventions
- Auth token in cookie (not httpOnly for client access)
- Protected routes listed explicitly
- Redirect URL preserved as `?redirect=` param
- Proxy keeps auth checks lightweight — full validation in layouts

## Anti-patterns
- Never make database calls in proxy — runs on every request
- Never store auth tokens only in localStorage — proxy can't read it
- Never call `cookies()` or `headers()` synchronously — they're async in Next.js 16
- Never name the file `middleware.ts` — Next.js 16 uses `proxy.ts`
