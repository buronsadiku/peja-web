---
name: env-management
description: Use this skill when adding or managing environment variables — typed access, server/client separation, and .env file conventions
type: skill
---

# Environment Variable Management

## When to Use
- Adding new environment variables
- Ensuring type-safe env access
- Understanding server vs client env separation

## Core Principles
- `NEXT_PUBLIC_*` prefix for client-accessible vars, everything else server-only
- Access via `process.env` — no runtime config (removed in Next.js 16)
- `.env.local` for secrets, `.env` for defaults, `.env.example` for documentation

## Typed Env Utility (simple)

```typescript
// src/lib/utils/env.ts
export const env = {
  // Public (available in browser)
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',

  // Server-only
  API_URL_INTERNAL: process.env.API_URL ?? '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? '',
  SENTRY_DSN: process.env.SENTRY_DSN ?? '',

  // Derived
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const
```

## With Zod Runtime Validation (recommended for production)

```typescript
// src/lib/utils/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  SENTRY_DSN: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

export const env = parsed.data
```

## Runtime Env Vars with `connection()` (Next.js 16)

For env vars that must be read at request time (not baked in at build), use `connection()` to opt out of static rendering:

```typescript
import { connection } from 'next/server'

export default async function Page() {
  await connection() // ensures this runs at request time
  const apiKey = process.env.DYNAMIC_API_KEY
  // ...
}
```

## .env.example

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000

# Server-only API URL (internal network)
API_URL=http://api:4000

# Payments
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Error Tracking
SENTRY_DSN=https://xxx@sentry.io/xxx
```

## Conventions
- `.env.example` checked into git — actual `.env` files gitignored
- Group vars by concern in comments
- Never default secrets to non-empty values
- `serverRuntimeConfig` / `publicRuntimeConfig` removed in Next.js 16 — use env vars

## Anti-patterns
- Never access `process.env.X` scattered across components — use typed `env` object
- Never commit `.env` files with real secrets
- Never prefix server-only secrets with `NEXT_PUBLIC_`
- Never use `serverRuntimeConfig` / `publicRuntimeConfig` — removed in Next.js 16, use env vars + `connection()`
