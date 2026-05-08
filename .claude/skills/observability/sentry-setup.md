---
name: sentry-setup
description: Use this skill when integrating Sentry error tracking — client/server init, source maps, error boundaries in Next.js 16
type: skill
---

# Sentry Error Tracking (Next.js 16)

## When to Use
- Adding error tracking to the project
- Configuring Sentry for client and server errors
- Setting up source maps for production debugging

## Core Principles
- Sentry init split: client, server, edge configs
- Disabled when `SENTRY_DSN` is not set
- Source maps uploaded during build, deleted after
- Turbopack compatible (Next.js 16 default bundler)

## Setup

```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Client init

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.025,
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 0.5,
  integrations: [Sentry.replayIntegration(), Sentry.browserTracingIntegration()],
  ignoreErrors: ['ResizeObserver loop', 'Network Error', 'AbortError'],
})
```

### Server init

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: !!process.env.SENTRY_DSN,
  tracesSampleRate: 0.025,
})
```

### Next.js config

```typescript
// next.config.ts
import { withSentryConfig } from '@sentry/nextjs'

export default withSentryConfig(withNextIntl(nextConfig), {
  org: '<SENTRY_ORG>',
  project: '<SENTRY_PROJECT>',
  silent: true,
  sourcemaps: { deleteSourcemapsAfterUpload: true },
})
```

### Global error page

```typescript
// src/app/global-error.tsx
'use client'
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => { Sentry.captureException(error) }, [error])

  return (
    <html><body>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </body></html>
  )
}
```

## Turbopack Compatibility

Next.js 16 uses Turbopack by default. Sentry source map upload works with Turbopack but:
- Ensure `@sentry/nextjs` is v8+ (Turbopack support added there)
- The `withSentryConfig` wrapper handles both Turbopack and webpack builds
- If you see source map issues in production, verify with `next build --webpack` to isolate whether it's a Turbopack-specific problem

## Plugin Composition Order

When combining multiple Next.js config wrappers, innermost runs first:

```typescript
// next.config.ts — withSentryConfig wraps withNextIntl wraps nextConfig
export default withSentryConfig(withNextIntl(nextConfig), sentryOptions)
```

## Conventions
- DSN optional — app works without it
- Trace rate: 2.5% prod, 100% dev
- Source maps deleted after upload
- Only capture unexpected errors, not validation/404s

## Anti-patterns
- Never hardcode the DSN
- Never set trace rate to 100% in production
- Never skip source map upload
