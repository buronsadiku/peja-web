# Marketing Landing Page

Full-scroll marketing landing page for Peja. Converts a reference JSX mockup (inline styles) into Tailwind-only components using the project's theme tokens. No hardcoded text — all strings from next-intl translations.

## Sections

1. **RootHeader** — sticky nav with Logo, links, sign in, CTA button. Shared layout component.
2. **HeroSection** — headline, description, two CTAs, social proof badges. Includes HeroShowpiece (polaroids, message card, stat pill).
3. **LogoBar** — "Featured in" press logos.
4. **HowItWorks** — 3-step cards with illustrations (QR cards, mic recording, morning inbox).
5. **SampleSpread** — editorial message card with stats (38 languages, lifetime storage, 0 downloads).
6. **FeaturesGrid** — bento grid (6 cards, 2 spanning 2 cols). 30-day ritual, languages, Gold Book, privacy, QR shipping, planner integrations.
7. **TestimonialSection** — full-bleed primary gradient background, couple quote, 3 stat cards.
8. **PricingSection** — 3-tier pricing (Essential free, Keepsake €189, Gold Book €389). Middle card highlighted with warm-panel background.
9. **FAQSection** — 2-column, 6 questions with accordion toggle.
10. **FinalCTA** — warm-cream gradient panel with domain claim input and CTA.
11. **RootFooter** — 5-column footer with Logo, nav columns, social icons, copyright. Shared layout component.

## New Theme Tokens

Add to `globals.css` in `:root`, `.dark`, and `@theme inline`:

- `--warm-cream` — light warm background for CTA panels
- `--warm-panel` — slightly darker warm background for highlighted pricing card

## Shared Components

- `packages/ui/src/components/Logo.tsx` — icon (32x32 rounded square with "O") + "Peja" wordmark. Accepts `className`, `iconOnly` prop.
- `src/features/layout/RootHeader.tsx` — sticky, blurred backdrop, Logo + nav links + sign in + CTA. Used in marketing layout.
- `src/features/layout/RootFooter.tsx` — columns, Logo, social icons, copyright. Used in marketing layout.

## New Icons

All in `packages/icons/src/`:
- ArrowRight, Play, Mic, Lock, Plus, Mail

## Lazy Loading

- HeroSection + LogoBar: eager (above the fold)
- HowItWorks, SampleSpread, FeaturesGrid, TestimonialSection, PricingSection, FAQSection, FinalCTA: loaded via `next/dynamic` with a lightweight loading fallback. SSR enabled so crawlers see full content.

## Translations

All text from `messages/en.json`. Key convention: `marketing__<section>__<element>`.

Server components use `getTranslations()`. Client components (FAQSection for accordion) use `useTranslations()`. Pure visual sections receive translated strings as props.

Namespaces:
- `marketing.nav.*` — header links and CTA
- `marketing.hero.*` — headline, description, CTAs, badge
- `marketing.logos.*` — featured in label
- `marketing.how.*` — eyebrow, titles, step titles/bodies/tags
- `marketing.sample.*` — eyebrow, title, description, stats, message content
- `marketing.features.*` — section title, card titles/bodies
- `marketing.testimonial.*` — eyebrow, quote, couple name, stats
- `marketing.pricing.*` — eyebrow, title, subtitle, tier names/prices/descriptions/features/CTAs
- `marketing.faq.*` — eyebrow, title, subtitle, email, questions/answers
- `marketing.cta.*` — eyebrow, title, description, button, disclaimer
- `common.footer.*` — tagline, copyright, column headers, links, social

## Token Mapping (reference → theme)

| Reference | Tailwind class |
|-----------|---------------|
| `LC.bg` | `bg-background` |
| `LC.ink` | `text-foreground` |
| `LC.inkSoft` | `text-muted-foreground` |
| `LC.blue` | `bg-primary` / `text-primary` |
| `LC.blueDeep` | `text-primary` (use as-is or `primary/80`) |
| `LC.peach` | `bg-destructive` / `text-destructive` |
| `LC.jade` | `bg-secondary` / `text-secondary` |
| `LC.kernel` | `bg-accent` / `text-accent` |
| `LC.line` | `border-border` |
| `WARM_CREAM` | `bg-warm-cream` (new token) |
| `WARM_PANEL` | `bg-warm-panel` (new token) |

## File List

| Action | Path |
|--------|------|
| Create | `packages/ui/src/components/Logo.tsx` |
| Create | `packages/icons/src/ArrowRight.tsx` |
| Create | `packages/icons/src/Play.tsx` |
| Create | `packages/icons/src/Mic.tsx` |
| Create | `packages/icons/src/Lock.tsx` |
| Create | `packages/icons/src/Plus.tsx` |
| Create | `packages/icons/src/Mail.tsx` |
| Create | `src/features/layout/RootHeader.tsx` |
| Create | `src/features/layout/RootFooter.tsx` |
| Create | `src/features/marketing/HeroSection.tsx` |
| Create | `src/features/marketing/HeroShowpiece.tsx` |
| Create | `src/features/marketing/LogoBar.tsx` |
| Create | `src/features/marketing/HowItWorks.tsx` |
| Create | `src/features/marketing/SampleSpread.tsx` |
| Create | `src/features/marketing/FeaturesGrid.tsx` |
| Create | `src/features/marketing/TestimonialSection.tsx` |
| Create | `src/features/marketing/PricingSection.tsx` |
| Create | `src/features/marketing/FAQSection.tsx` |
| Create | `src/features/marketing/FinalCTA.tsx` |
| Modify | `src/app/globals.css` — add warm-cream, warm-panel tokens |
| Modify | `src/app/[locale]/(marketing)/layout.tsx` — RootHeader + RootFooter |
| Modify | `src/app/[locale]/(marketing)/page.tsx` — compose sections with lazy loading |
| Modify | `messages/en.json` — all marketing + common.footer translation keys |
