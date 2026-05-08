---
name: next-intl-setup
description: Use this skill when working with next-intl v4 — routing config, createNavigation, translation loading, and translation key conventions
type: skill
---

# next-intl v4 Internationalization

## When to Use
- Setting up or modifying i18n configuration
- Adding new translation keys
- Building locale-aware navigation
- Working with translations in server or client components

## Core Principles
- All user-facing strings use `useTranslations()` (client) or `getTranslations()` (server)
- Locale prefix: `as-needed` — default locale (`en`) has no prefix
- Navigation exports (`Link`, `redirect`, `useRouter`) from `@/i18n/navigation` — never raw `next/link`
- `proxy.ts` handles locale detection (Next.js 16 uses proxy, not middleware)
- **Language and currency are independent** — currency comes from the backend, not the locale

## File Structure

```
src/i18n/
├── config.ts       # Locales, default locale, Locale type
├── routing.ts      # defineRouting config
├── navigation.ts   # createNavigation exports (Link, redirect, useRouter, etc.)
└── request.ts      # getRequestConfig — loads messages per locale

messages/
├── en.json         # English translations (source of truth)
├── fr.json         # French
├── nl.json         # Dutch
├── de.json         # German
├── es.json         # Spanish
└── it.json         # Italian
```

## Code Templates

### Config

```typescript
// src/i18n/config.ts
export const locales = ['en', 'fr', 'nl', 'de', 'es', 'it'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
```

### Routing

```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
})
```

### Navigation exports

```typescript
// src/i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
```

### Request config (message loading)

```typescript
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import { hasLocale } from 'next-intl'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !hasLocale(routing.locales, locale)) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

### Next.js plugin

```typescript
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
export default withNextIntl(nextConfig)
```

### Proxy (Next.js 16 — replaces middleware)

```typescript
// src/proxy.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export const proxy = (request: Request) => {
  return intlMiddleware(request as any)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
```

### Server component usage

```typescript
import { getTranslations } from 'next-intl/server'

const AboutPage = async () => {
  const t = await getTranslations()
  return <h1>{t('about__title')}</h1>
}

export default AboutPage
```

### Client component usage

```typescript
'use client'
import { useTranslations } from 'next-intl'

export const LoginForm = () => {
  const t = useTranslations()
  return <h2>{t('auth__login__title')}</h2>
}
```

### Language switcher

```typescript
'use client'
import { usePathname, useRouter } from '@/i18n/navigation'
import { locales } from '@/i18n/config'

export const LanguageSwitcher = () => {
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (locale: string) => {
    router.replace(pathname, { locale })
  }

  return (
    <select onChange={(e) => handleChange(e.target.value)}>
      {locales.map((loc) => (
        <option key={loc} value={loc}>{loc.toUpperCase()}</option>
      ))}
    </select>
  )
}
```

## Translation Key Convention

**Always use snake_case** for JSON keys. Use nesting for hierarchy, double underscores for flat access:

```
JSON nesting:                     Flat access with t():
marketing.cta.domain_prefix       t('domain_prefix') with namespace 'marketing.cta'

Examples:
  auth.login.title               → "Log in to your account"
  event.create.title             → "Create Event"
  common.save                    → "Save"
  marketing.hero.cta_primary     → "Start your book — €0 today"
  marketing.cta.domain_prefix    → "peja.love/"
```

Key naming rules:
- **Flat keys with `__` separators** — no JSON nesting, every key is top-level
- **Always lowercase snake_case** within segments — `domain_prefix`, `cta_primary` (never camelCase, never UPPERCASE)
- **Always `useTranslations()` with no namespace** — access keys directly: `t('marketing__cta__domain_prefix')`
- **No arrays** — expand into individual keys: `common__footer__company_links__about`

Scopes: `auth`, `event`, `common`, `validation`, `seo`, `error`, `marketing`, `guest`, `kiosk`

## Conventions
- Always use `Link` / `useRouter` from `@/i18n/navigation` — never `next/link`
- Always use arrow functions for components
- Translation keys: flat with `__` separators, always snake_case — `marketing__hero__cta_primary`
- Always `useTranslations()` with no namespace argument
- No arrays in translations — expand to individual keys
- Default locale (`en`) has no URL prefix; all others do
- Messages loaded from JSON files in `messages/` directory
- Currency is backend-driven, not tied to locale — never couple them

## Anti-patterns
- Never hardcode strings in components — always use `t('key')`
- Never use `next/link` or `next/navigation` directly
- Never create a custom Link wrapper — `createNavigation` handles everything
- Never store locale in state — use the URL and cookie as source of truth
- Never derive currency from locale — currency comes from backend/user settings
- Never use `useTranslations('namespace')` — always `useTranslations()` with full flat keys
- Never use `t.raw()` — no arrays in translations
- Never nest JSON in message files — all keys are flat with `__` separators
