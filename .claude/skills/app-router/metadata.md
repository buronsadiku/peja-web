---
name: metadata
description: Use this skill when implementing SEO metadata with generateMetadata, Open Graph, language alternates, and async params in Next.js 16
type: skill
---

# Metadata and SEO (Next.js 16)

## When to Use
- Adding SEO metadata to new pages
- Setting up Open Graph and social sharing
- Implementing language alternate URLs for multi-locale sites

## Core Principles
- Root layout sets **default metadata** with title template
- Pages export `generateMetadata` functions with **async params**
- Language alternates generated for all supported locales
- `params` and `searchParams` are Promises — must await

## Code Templates

### Root metadata (actual — in `src/app/layout.tsx`)

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: 'Peja — Capture Your Wedding Messages',
  description:
    'Let your guests leave audio messages, photos, and notes — and turn them into beautiful keepsakes.',
}
```

When pages need their own titles, upgrade to a template:

```typescript
export const metadata: Metadata = {
  title: {
    default: 'Peja — Capture Your Wedding Messages',
    template: '%s | Peja',
  },
  description: 'Let your guests leave audio messages, photos, and notes — and turn them into beautiful keepsakes.',
  icons: { icon: '/favicon.ico' },
  robots: { index: true, follow: true },
}
```

### Page metadata with async params

```typescript
// src/features/marketing/AboutPage.tsx
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'

export async function generateAboutMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('seo__about__title'),
    description: t('seo__about__description'),
    alternates: {
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `/${loc}/about`]),
      ),
    },
  }
}
```

### Dynamic page metadata

```typescript
export async function generatePostMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPost(slug, locale)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
      type: 'article',
    },
  }
}
```

### Usage in route file

```typescript
// src/app/[locale]/(marketing)/about/page.tsx
import { AboutPage, generateAboutMetadata } from '@/features/marketing/AboutPage'
export const generateMetadata = generateAboutMetadata
export default AboutPage
```

## Conventions
- Title template in root: `'%s | Peja'` — pages set the page-specific part
- Every public page has `generateMetadata`
- Language alternates include all supported locales
- `params` is always `Promise<T>` in `generateMetadata` — must await

## Anti-patterns
- Never hardcode metadata in route files — use `generateMetadata` from `@/features/`
- Never skip language alternates on multi-locale pages
- Never destructure params synchronously in generateMetadata
- Never duplicate SEO strings — use translation keys
