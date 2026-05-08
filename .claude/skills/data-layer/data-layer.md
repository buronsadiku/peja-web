---
name: data-layer
description: Use this skill when setting up API clients, data fetching in server/client components, caching strategies, and server-to-client data flow in Next.js 16
type: skill
---

# Data Layer (Next.js 16)

## When to Use
- Setting up the HTTP client for API communication
- Fetching data in server components (layouts, pages)
- Making API calls from client components (forms, interactions)
- Deciding between caching strategies

## Core Principles
- **Server components fetch data by default** — no loading spinners, no waterfalls
- Client components call APIs only for **mutations and user-triggered fetches**
- `fetch()` is **not cached by default** in Next.js 16 — must opt in explicitly
- Server data flows to client via **props**
- Auth tokens read via `await cookies()` (async in Next.js 16)

## API Client Setup

```typescript
// src/lib/api/client.ts
import 'server-only'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body?: unknown,
  ) {
    super(`API error: ${status} ${statusText}`)
    this.name = 'ApiError'
  }
}

// Server-side authenticated fetch
export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { body?: unknown },
): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  const { body, ...rest } = options ?? {}

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...rest.headers,
    },
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => undefined)
    throw new ApiError(res.status, res.statusText, errorBody)
  }

  return res.json()
}

// Client-side fetch (reads token from cookie via browser)
export async function clientFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`/api/proxy${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
```

## Server Component Data Fetching

```typescript
// src/features/dashboard/DashboardPage.tsx
import { apiFetch } from '@/lib/api/client'

export default async function DashboardPage() {
  const events = await apiFetch<Event[]>('/events')

  return <EventList events={events} />
}
```

## Client-side Mutation

```typescript
// src/features/events/CreateEventForm.tsx
'use client'

import { clientFetch } from '@/lib/api/client'

async function onSubmit(values: CreateEventPayload) {
  try {
    await clientFetch('/events', {
      method: 'POST',
      body: JSON.stringify(values),
    })
    // Success handling
  } catch (error) {
    // Error handling
  }
}
```

## Caching Strategies (Next.js 16)

**Default: no caching.** Must opt in explicitly.

```typescript
// Static data — cached indefinitely
const languages = await fetch(`${API_URL}/languages`, {
  cache: 'force-cache',
})

// TTL-based — revalidate every 60 seconds
const translations = await fetch(`${API_URL}/translations/${locale}`, {
  next: { revalidate: 60 },
})

// Dynamic data — no cache (default, but explicit for clarity)
const user = await apiFetch('/user/me')
```

### Caching Decision Matrix

| Data Type | Strategy | Example |
|-----------|----------|---------|
| Static reference data | `cache: 'force-cache'` | Languages, countries |
| Translations | `next: { revalidate: 60 }` | i18n strings |
| User-specific data | No cache (default) | Profile, dashboard |
| Public content | `next: { revalidate: 3600 }` | Blog posts, FAQ |

## Route Handlers (API Proxy)

```typescript
// src/app/api/proxy/[...path]/route.ts
import { cookies } from 'next/headers'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  const res = await fetch(`${process.env.API_URL}/${path.join('/')}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })

  return Response.json(await res.json(), { status: res.status })
}
```

## Service Pattern

```typescript
// src/lib/api/events.ts
import { apiFetch } from './client'
import type { Event, CreateEventPayload } from '@/features/domain/types'

export const eventsApi = {
  list: () => apiFetch<Event[]>('/events'),
  get: (id: string) => apiFetch<Event>(`/events/${id}`),
  create: (data: CreateEventPayload) =>
    apiFetch<Event>('/events', { method: 'POST', body: data }),
  update: (id: string, data: Partial<CreateEventPayload>) =>
    apiFetch<Event>(`/events/${id}`, { method: 'PATCH', body: data }),
  delete: (id: string) =>
    apiFetch<void>(`/events/${id}`, { method: 'DELETE' }),
}
```

## Conventions
- `apiFetch()` is server-only (imports `server-only`) — never import in client components
- Client components use `clientFetch()` (proxied through route handler)
- `cookies()` is async — always `await`
- Error handling: catch `ApiError` for typed status/body access; server components redirect on 401, client components show notifications
- API modules organized by domain: `eventsApi`, `usersApi`, etc.
- The `/api/proxy/[...path]` route handler must be created for `clientFetch` to work

## Anti-patterns
- Never fetch in `useEffect` what a server component could have provided as props
- Never call `cookies()` synchronously — it's async in Next.js 16
- Never cache user-specific data
- Never put data fetching in layout if it's page-specific
- Never create multiple fetch wrappers — one `apiFetch` for server, one `clientFetch` for client
