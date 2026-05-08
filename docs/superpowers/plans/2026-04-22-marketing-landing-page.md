# Marketing Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-scroll marketing landing page with 10 sections, using Tailwind theme tokens only (no inline styles, no raw colors), all text from next-intl translations, lazy-loaded below-the-fold sections.

**Architecture:** Each section is its own component in `src/features/marketing/`. Shared layout components (RootHeader, RootFooter, Logo) live in `src/features/layout/` and `packages/ui/`. The marketing layout composes header + footer. The page composes all sections with `next/dynamic` for below-the-fold lazy loading. All visible text comes from `messages/en.json` via `useTranslations()`.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, next-intl v4, `@peja/ui`, `@peja/icons`

**Project rules:**
- Arrow functions only (`export const X = () => {}`)
- No code comments
- No raw Tailwind colors — theme tokens only
- No inline styles
- All text from translations

---

### Task 1: Add theme tokens + icons

**Files:**
- Modify: `src/app/globals.css`
- Create: `packages/icons/src/ArrowRight.tsx`
- Create: `packages/icons/src/Play.tsx`
- Create: `packages/icons/src/Mic.tsx`
- Create: `packages/icons/src/Lock.tsx`
- Create: `packages/icons/src/Plus.tsx`
- Create: `packages/icons/src/Mail.tsx`

- [ ] **Step 1: Add warm-cream and warm-panel tokens to globals.css**

Add these to `@theme inline` block:
```css
  --color-warm-cream: var(--warm-cream);
  --color-warm-panel: var(--warm-panel);
```

Add to `:root`:
```css
  --warm-cream: oklch(0.955 0.015 75);
  --warm-panel: oklch(0.920 0.025 75);
```

Add to `.dark`:
```css
  --warm-cream: oklch(0.220 0.010 75);
  --warm-panel: oklch(0.260 0.015 75);
```

- [ ] **Step 2: Create all 6 icon components**

Each icon follows this pattern (Lucide SVG paths):

`packages/icons/src/ArrowRight.tsx`:
```tsx
export const ArrowRight = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
```

`packages/icons/src/Play.tsx`:
```tsx
export const Play = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"
      fill="currentColor" stroke="none" {...props}>
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
```

`packages/icons/src/Mic.tsx`:
```tsx
export const Mic = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </svg>
  )
}
```

`packages/icons/src/Lock.tsx`:
```tsx
export const Lock = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
```

`packages/icons/src/Plus.tsx`:
```tsx
export const Plus = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
```

`packages/icons/src/Mail.tsx`:
```tsx
export const Mail = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css packages/icons/src/ArrowRight.tsx packages/icons/src/Play.tsx packages/icons/src/Mic.tsx packages/icons/src/Lock.tsx packages/icons/src/Plus.tsx packages/icons/src/Mail.tsx
git commit -m "feat: add warm theme tokens and icon components for marketing page"
```

---

### Task 2: Add all translations to messages/en.json

**Files:**
- Modify: `messages/en.json`

- [ ] **Step 1: Replace the `marketing` and add `footer` sections in `messages/en.json`**

Replace the existing `"marketing"` key and add `"footer"` key inside `"common"`. The full marketing section should be:

```json
"marketing": {
  "nav": {
    "howItWorks": "How it works",
    "keepsakes": "Keepsakes",
    "pricing": "Pricing",
    "stories": "Stories",
    "forPlanners": "For planners",
    "signIn": "Sign in",
    "cta": "Start your book"
  },
  "hero": {
    "badge": "Used at {count}+ weddings in {countries} countries",
    "titleLine1": "Your wedding,",
    "titleLine2": "in their voices.",
    "description": "Peja is a keepsake app for the people you love most. Guests scan a QR code, leave a 30–90 second voice message and a photo. You open one every morning — for as long as you'd like.",
    "ctaPrimary": "Start your book — €0 today",
    "ctaSecondary": "See a sample book",
    "socialProof": "{rating} ★ avg · read by couples on every anniversary"
  },
  "logos": {
    "title": "Featured in"
  },
  "how": {
    "eyebrow": "How Peja works",
    "titleLine1": "Three steps.",
    "titleLine2": "A lifetime to revisit.",
    "subtitle": "Designed so your 82-year-old grandmother can leave a message without asking anyone for help.",
    "step1Tag": "10 minutes",
    "step1Title": "You set up the book",
    "step1Body": "Pick your wedding date, add the couple names and a cover photo. We print a deck of elegant QR cards — one per table — and ship them in time.",
    "step2Tag": "On the day",
    "step2Title": "Guests leave voices and photos",
    "step2Body": "They scan, pick a language, and record 30–90 seconds. A photo snap goes with every message. No app to download. Works offline; syncs when reception returns.",
    "step3Tag": "For as long as you like",
    "step3Title": "You open one every morning",
    "step3Body": "After the wedding, your inbox fills over 30 days. Save favourites, order the Gold Book, or just revisit on anniversaries. Everything stays yours, forever."
  },
  "sample": {
    "eyebrow": "A real message",
    "titleStart": "Not a form.",
    "titleEnd": "A voice.",
    "description": "Typed wedding guest books fill up with \"Congrats!!\" Peja captures the tremor in your father's voice, your best friend laughing mid-sentence, your grandmother switching to her mother tongue. We transcribe and translate every message in 38 languages — you keep the original audio.",
    "stat1Value": "38",
    "stat1Label": "Languages, auto-translated",
    "stat2Value": "∞",
    "stat2Label": "Lifetime audio storage",
    "stat3Value": "0",
    "stat3Label": "App downloads required",
    "entryLabel": "Entry № 47 · Mas de la Calma, Girona",
    "quote": "\"Mi niña. I watched you dance tonight, and I saw your mother — God rest her — in every turn. She would be so proud. I am so proud. Live long and argue well, hija.\"",
    "authorName": "Abuela Carmen",
    "authorRole": "Grandmother of the bride · Recorded in Spanish",
    "savedTag": "♡ Saved to Gold Book"
  },
  "features": {
    "eyebrow": "Everything in one book",
    "titleLine1": "Thoughtful where it counts.",
    "titleLine2": "Invisible where it shouldn't.",
    "ritualEyebrow": "The 30-day ritual",
    "ritualTitle": "One message a morning, for a month after your wedding.",
    "ritualBody": "Messages unlock one per day — a gentle antidote to the post-wedding comedown.",
    "langEyebrow": "Auto-translated",
    "langTitle": "38 languages, preserved in the original voice.",
    "bookEyebrow": "Keepsake",
    "bookTitle": "The Gold Book — 180 pages, letterpressed.",
    "bookPrice": "from €189",
    "bookShipping": "Ships in 3 weeks",
    "privacyEyebrow": "Private by default",
    "privacyTitle": "Only you and your partner see anything. Ever.",
    "privacyDetail": "End-to-end encrypted · GDPR · EU data residency",
    "qrEyebrow": "In the mail",
    "qrTitle": "Letterpress QR cards, free shipping worldwide.",
    "plannerEyebrow": "For the people who plan it",
    "plannerTitle": "A tiny QR stand for every table, a dashboard for your planner.",
    "plannerBody": "One-click sync with your registry & guest list. Planners get a co-pilot seat."
  },
  "testimonial": {
    "eyebrow": "From the couples",
    "quote": "\"We listened to my late father's message on our first anniversary, in the kitchen, at midnight. I don't know another product that has earned me that moment.\"",
    "coupleName": "Sofía Ruiz & Matteo Bernal",
    "coupleDetail": "Married 12 September 2024 · Mallorca",
    "stat1Value": "2,840",
    "stat1Label": "Weddings hosted",
    "stat2Value": "148,000",
    "stat2Label": "Voice messages recorded",
    "stat3Value": "4.9 ★",
    "stat3Label": "Avg. couple rating (612 reviews)"
  },
  "pricing": {
    "eyebrow": "Pricing",
    "title": "One book, three ways.",
    "subtitle": "Pay once. No subscriptions. No per-message fees. Messages are yours, forever.",
    "essentialTag": "For small weddings",
    "essentialName": "Essential",
    "essentialPrice": "€0",
    "essentialPer": "free, forever",
    "essentialDesc": "Up to 40 guests. All core features, QR cards not included.",
    "essentialFeats": ["Unlimited messages & photos", "Auto-transcription (38 langs)", "Web dashboard", "30-day ritual inbox", "Lifetime audio storage"],
    "essentialCta": "Start free",
    "keepsakeTag": "Most couples",
    "keepsakeName": "Keepsake",
    "keepsakePrice": "€189",
    "keepsakePer": "one-time",
    "keepsakeDesc": "Everything in Essential, plus the things that make Peja feel like an heirloom.",
    "keepsakeFeats": ["Up to 250 guests", "Letterpress QR card deck (shipped)", "Unlimited languages & translations", "Planner co-pilot seat", "Priority guest support", "Custom couple domain"],
    "keepsakeCta": "Choose Keepsake",
    "keepsakeHighlight": "MOST CHOSEN",
    "goldTag": "The full experience",
    "goldName": "Gold Book",
    "goldPrice": "€389",
    "goldPer": "one-time",
    "goldDesc": "Keepsake plus the physical book — 180 letterpressed pages, bound in linen.",
    "goldFeats": ["Everything in Keepsake", "The Gold Book (180 pp, linen bound)", "Custom cover foil & monogram", "Archival-grade paper", "Global free shipping", "25% off re-prints forever"],
    "goldCta": "Choose Gold Book"
  },
  "faq": {
    "eyebrow": "Questions",
    "titleLine1": "Small print,",
    "titleLine2": "plainly said.",
    "subtitle": "Something missing? We answer every email within 4 hours — even on weekends, because weddings happen on weekends.",
    "email": "hello@peja.love",
    "q1": "How does Peja actually work on the wedding day?",
    "a1": "We ship you a deck of letterpressed QR cards — one per table, plus a few for the bar. Guests scan with any phone, pick a language, record 30–90 seconds and snap a photo. No app to download. Works on iOS, Android, and any browser from the last 8 years.",
    "q2": "What about guests who are not tech-savvy, or elderly?",
    "a2": "The record screen is one button. Typography is 28px minimum. Uncles, aunts and grandmothers make up ~40% of our messages — by design.",
    "q3": "Can guests leave messages before the wedding?",
    "a3": "Yes. Open the book 4 weeks before. We send gentle nudges if you want.",
    "q4": "How long do you keep the audio?",
    "a4": "Forever. Original WAV files, stored on EU servers, downloadable anytime as a .zip. No monthly fees.",
    "q5": "Can we get a physical book?",
    "a5": "The Gold Book plan includes a 180-page linen-bound volume, letterpressed, with transcripts + favourite photos + QR codes to play back each voice. Most couples order 3 copies.",
    "q6": "Is it private?",
    "a6": "Only the couple accounts can see anything. Messages are end-to-end encrypted. We never train models on your data. GDPR-compliant, EU-resident."
  },
  "cta": {
    "eyebrow": "You have time",
    "titleLine1": "Open your book.",
    "titleLine2": "Today.",
    "description": "Set-up takes 10 minutes. Free forever on the Essential plan. Upgrade when your guest list is final — or never. The book is yours either way.",
    "quickStart": "Quick start",
    "domainPrefix": "peja.love/",
    "domainPlaceholder": "lena-and-tomas",
    "button": "Claim your link — start free",
    "disclaimer": "No credit card required · cancel anytime"
  }
},
```

And add to `"common"`:
```json
"footer": {
  "tagline": "Made in Barcelona and Amsterdam by people who cried at their own weddings.",
  "copyright": "© 2026 Peja Keepsakes, S.L. · All rights reserved.",
  "product": "Product",
  "productLinks": ["How it works", "Gold Book", "Keepsakes store", "Pricing", "For planners", "Changelog"],
  "loveNotes": "Love notes",
  "loveNotesLinks": ["Sample book", "Couple stories", "Write a review", "Press", "Podcast"],
  "company": "Company",
  "companyLinks": ["About", "Careers", "Sustainability", "Press kit", "Contact"],
  "legal": "Legal",
  "legalLinks": ["Privacy", "Terms", "Cookies", "GDPR", "DPA for planners"],
  "language": "English",
  "currency": "EUR",
  "status": "Status · All systems normal"
}
```

- [ ] **Step 2: Commit**

```bash
git add messages/en.json
git commit -m "feat: add all marketing landing page translations"
```

---

### Task 3: Create Logo component

**Files:**
- Create: `packages/ui/src/components/Logo.tsx`

- [ ] **Step 1: Create the component**

```tsx
// packages/ui/src/components/Logo.tsx
import { cn } from '../utils/cn'

type LogoProps = {
  iconOnly?: boolean
  className?: string
}

export const Logo = ({ iconOnly, className }: LogoProps) => {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary font-serif text-base font-bold text-primary-foreground">
        O
      </div>
      {!iconOnly && (
        <span className="font-serif text-xl font-semibold text-foreground">Peja</span>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/ui/src/components/Logo.tsx
git commit -m "feat: add reusable Logo component"
```

---

### Task 4: Create RootHeader

**Files:**
- Create: `src/features/layout/RootHeader.tsx`

- [ ] **Step 1: Create the component**

This is a `'use client'` component since it uses `useTranslations()` and `usePathname()`.

```tsx
// src/features/layout/RootHeader.tsx
'use client'

import { useTranslations } from 'next-intl'
import { Logo } from '@peja/ui/components/Logo'
import { Button } from '@peja/ui/components/Button'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from '@peja/icons/ArrowRight'
import { ThemeToggle } from '@peja/ui/components/ThemeToggle'
import { cn } from '@peja/ui/utils/cn'

export const RootHeader = ({ className }: { className?: string }) => {
  const t = useTranslations('marketing.nav')

  return (
    <header className={cn(
      'sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md',
      className,
    )}>
      <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-6 lg:px-20">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link href="/how-it-works" className="font-medium hover:text-foreground">{t('howItWorks')}</Link>
          <Link href="/keepsakes" className="font-medium hover:text-foreground">{t('keepsakes')}</Link>
          <Link href="/pricing" className="font-medium hover:text-foreground">{t('pricing')}</Link>
          <Link href="/stories" className="font-medium hover:text-foreground">{t('stories')}</Link>
          <Link href="/for-planners" className="font-medium hover:text-foreground">{t('forPlanners')}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/sign-in" className="hidden text-sm font-medium text-foreground md:block">
            {t('signIn')}
          </Link>
          <Button size="sm" className="gap-1.5">
            {t('cta')}
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/layout/RootHeader.tsx
git commit -m "feat: add RootHeader with nav links and translations"
```

---

### Task 5: Create RootFooter

**Files:**
- Create: `src/features/layout/RootFooter.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/features/layout/RootFooter.tsx
'use client'

import { useTranslations } from 'next-intl'
import { Logo } from '@peja/ui/components/Logo'
import { cn } from '@peja/ui/utils/cn'

export const RootFooter = ({ className }: { className?: string }) => {
  const t = useTranslations('common.footer')

  const columns = [
    { title: t('product'), links: t.raw('productLinks') as string[] },
    { title: t('loveNotes'), links: t.raw('loveNotesLinks') as string[] },
    { title: t('company'), links: t.raw('companyLinks') as string[] },
    { title: t('legal'), links: t.raw('legalLinks') as string[] },
  ]

  return (
    <footer className={cn('border-t border-border bg-card', className)}>
      <div className="mx-auto max-w-[1240px] px-6 pb-10 pt-16 lg:px-20">
        <div className="grid grid-cols-2 gap-10 pb-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Logo className="mb-4" />
            <p className="max-w-[280px] text-sm leading-relaxed text-muted-foreground">
              {t('tagline')}
            </p>
            <div className="mt-5 flex gap-2.5">
              {['IG', 'TT', 'YT', 'PN'].map((label) => (
                <div key={label} className="flex size-9 items-center justify-center rounded-full border border-border text-xs font-bold text-muted-foreground">
                  {label}
                </div>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="mb-3.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                {col.title}
              </div>
              <div className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <a key={link} className="cursor-pointer text-sm text-foreground hover:text-primary">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <div>{t('copyright')}</div>
          <div className="flex gap-5">
            <span>🌐 {t('language')}</span>
            <span>€ {t('currency')}</span>
            <span>{t('status')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/layout/RootFooter.tsx
git commit -m "feat: add RootFooter with translated columns"
```

---

### Task 6: Create HeroSection + HeroShowpiece

**Files:**
- Create: `src/features/marketing/HeroSection.tsx`
- Create: `src/features/marketing/HeroShowpiece.tsx`

- [ ] **Step 1: Create HeroShowpiece**

This is the decorative right-side of the hero — polaroids, message card with waveform, stat pill. Pure visual, server component, receives no translations (all visual/decorative content).

The implementer should reference the spec's `HeroShowpiece` function for the exact layout: tilted polaroid cards, a floating "Just arrived" stat pill, a main message card with avatar + quote + waveform, and a bottom polaroid. Convert all inline styles to Tailwind classes. Use `bg-primary`, `bg-destructive`, `text-primary-foreground`, `border-border`, etc.

Key visual elements:
- Back polaroid: rotated -9deg, white card, gradient placeholder with serif initial "M"
- Stat pill: rotated 4deg, "Just arrived · Abuela Carmen · 1:47" with Check icon
- Main card: avatar circle with initials "MD", italic serif quote, waveform bars (44 spans), play button
- Front polaroid: rotated 7deg, blue gradient, serif initial "J"

- [ ] **Step 2: Create HeroSection**

`'use client'` component using `useTranslations('marketing.hero')`.

Layout: 2-column grid (1.15fr 1fr on desktop, stacked on mobile). Left: badge pill, h1 (96px serif), description, 2 CTA buttons, social proof with avatar circles. Right: `<HeroShowpiece />`. Decorative radial gradient blobs using `bg-primary/15` and `bg-destructive/10` positioned absolutely.

- [ ] **Step 3: Commit**

```bash
git add src/features/marketing/HeroSection.tsx src/features/marketing/HeroShowpiece.tsx
git commit -m "feat: add HeroSection with showpiece and translations"
```

---

### Task 7: Create LogoBar

**Files:**
- Create: `src/features/marketing/LogoBar.tsx`

- [ ] **Step 1: Create the component**

`'use client'` component. Displays "Featured in" eyebrow + row of press logo names in serif font at 50% opacity. Logos are text-only placeholders: 'The Knot', 'Vogue Weddings', 'Condé Nast', 'Bruid&Bruidegom', 'Hola! Novias', 'Martha Stewart'.

- [ ] **Step 2: Commit**

```bash
git add src/features/marketing/LogoBar.tsx
git commit -m "feat: add LogoBar section"
```

---

### Task 8: Create HowItWorks

**Files:**
- Create: `src/features/marketing/HowItWorks.tsx`

- [ ] **Step 1: Create the component**

`'use client'` component using `useTranslations('marketing.how')`.

Layout: eyebrow + h2 title + subtitle on left, then 3-column grid of step cards. Each card: step number (italic serif, colored), tag pill, illustration area (160px), title, body text. Card backgrounds: `bg-background`, rounded-3xl, border.

Step illustrations:
- Step 1 (setup): 3 fanned QR card rectangles with fake QR pattern
- Step 2 (record): pulsing mic circle with waveform bars, tinted with `bg-destructive`
- Step 3 (open): mini message card showing "Tuesday · 7:12 am" with waveform

Colors: step1 = primary, step2 = destructive, step3 = secondary.

- [ ] **Step 2: Commit**

```bash
git add src/features/marketing/HowItWorks.tsx
git commit -m "feat: add HowItWorks section with step cards"
```

---

### Task 9: Create SampleSpread

**Files:**
- Create: `src/features/marketing/SampleSpread.tsx`

- [ ] **Step 1: Create the component**

`'use client'` component using `useTranslations('marketing.sample')`.

2-column grid. Left: eyebrow, h2 ("Not a form. *A voice.*"), description, 3-stat grid (38 languages, ∞ storage, 0 downloads). Right: editorial card with entry label, italic serif quote, dashed divider, avatar + author name/role + play button. "Saved to Gold Book" tag absolutely positioned top-right.

- [ ] **Step 2: Commit**

```bash
git add src/features/marketing/SampleSpread.tsx
git commit -m "feat: add SampleSpread section"
```

---

### Task 10: Create FeaturesGrid

**Files:**
- Create: `src/features/marketing/FeaturesGrid.tsx`

- [ ] **Step 1: Create the component**

`'use client'` component using `useTranslations('marketing.features')`.

Centered eyebrow + h2, then 4-column bento grid (2 rows of 260px). 6 cards total:
1. **30-day ritual** (spans 2 cols): title, body, 30 small bars visualization
2. **Languages** (tinted peach/destructive): title, language tag pills
3. **Gold Book** (tinted accent): title, mini book visual, price + shipping
4. **Privacy** (tinted secondary): title, lock icon, detail text
5. **QR shipping** (white): title, 4 fanned mini QR cards
6. **Integrations** (spans 2 cols, tinted primary): title, integration name pills, body

- [ ] **Step 2: Commit**

```bash
git add src/features/marketing/FeaturesGrid.tsx
git commit -m "feat: add FeaturesGrid bento section"
```

---

### Task 11: Create TestimonialSection

**Files:**
- Create: `src/features/marketing/TestimonialSection.tsx`

- [ ] **Step 1: Create the component**

`'use client'` component using `useTranslations('marketing.testimonial')`.

Full-bleed section with `bg-gradient-to-br from-primary to-primary/80` and white text. Decorative gradient blobs. 2-column layout (2fr 1fr). Left: eyebrow, large italic serif quote, avatar + couple name + detail. Right: 3 stat cards with glass-morphism style (`bg-white/10 backdrop-blur border border-white/20`).

- [ ] **Step 2: Commit**

```bash
git add src/features/marketing/TestimonialSection.tsx
git commit -m "feat: add TestimonialSection"
```

---

### Task 12: Create PricingSection

**Files:**
- Create: `src/features/marketing/PricingSection.tsx`

- [ ] **Step 1: Create the component**

`'use client'` component using `useTranslations('marketing.pricing')`.

Centered eyebrow + h2 + subtitle. 3-column grid of pricing cards.

Middle card (Keepsake) is highlighted: `bg-warm-panel` background, `scale-[1.02]`, "MOST CHOSEN" badge, destructive-colored CTA button with shadow. Other cards: white bg, outline CTA buttons.

Each card: tag, name (serif 30px), price (serif 56px) + period, description, divider, feature list with Check icons, full-width CTA button.

Features come from translation arrays (`t.raw('essentialFeats')` etc.).

- [ ] **Step 2: Commit**

```bash
git add src/features/marketing/PricingSection.tsx
git commit -m "feat: add PricingSection with three tiers"
```

---

### Task 13: Create FAQSection

**Files:**
- Create: `src/features/marketing/FAQSection.tsx`

- [ ] **Step 1: Create the component**

`'use client'` component using `useTranslations('marketing.faq')` with `useState` for open/closed accordion state.

2-column layout (1fr 1.5fr). Left: eyebrow, h2, subtitle, email link with ArrowRight icon. Right: 6 FAQ items. Each item: serif question, +/- toggle button (rotates 45deg when open), answer text that shows/hides. First item open by default.

Toggle button: rounded-full, `bg-primary text-primary-foreground` when open, `bg-card border border-border` when closed.

- [ ] **Step 2: Commit**

```bash
git add src/features/marketing/FAQSection.tsx
git commit -m "feat: add FAQSection with accordion"
```

---

### Task 14: Create FinalCTA

**Files:**
- Create: `src/features/marketing/FinalCTA.tsx`

- [ ] **Step 1: Create the component**

`'use client'` component using `useTranslations('marketing.cta')`.

Outer container with max-w-[1240px]. Inner card: `bg-gradient-to-br from-warm-cream to-warm-panel` with rounded-[32px], border, shadow. 2-column grid.

Left: eyebrow (destructive color), large serif h2, description. Decorative gradient blobs positioned absolutely.

Right: "Quick start" label, domain input mockup (`bg-white/75 backdrop-blur border rounded-2xl` with "peja.love/" prefix + italic placeholder + green check circle), full-width destructive CTA button with ArrowRight icon, disclaimer text.

- [ ] **Step 2: Commit**

```bash
git add src/features/marketing/FinalCTA.tsx
git commit -m "feat: add FinalCTA section"
```

---

### Task 15: Wire up marketing layout and page

**Files:**
- Modify: `src/app/[locale]/(marketing)/layout.tsx`
- Modify: `src/app/[locale]/(marketing)/page.tsx`

- [ ] **Step 1: Update marketing layout**

```tsx
// src/app/[locale]/(marketing)/layout.tsx
import { RootHeader } from '@/features/layout/RootHeader'
import { RootFooter } from '@/features/layout/RootFooter'

const MarketingLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <>
      <RootHeader />
      <main className="flex-1">{children}</main>
      <RootFooter />
    </>
  )
}

export default MarketingLayout
```

- [ ] **Step 2: Update marketing page with lazy-loaded sections**

```tsx
// src/app/[locale]/(marketing)/page.tsx
import dynamic from 'next/dynamic'
import { HeroSection } from '@/features/marketing/HeroSection'
import { LogoBar } from '@/features/marketing/LogoBar'

const HowItWorks = dynamic(() => import('@/features/marketing/HowItWorks').then(m => ({ default: m.HowItWorks })))
const SampleSpread = dynamic(() => import('@/features/marketing/SampleSpread').then(m => ({ default: m.SampleSpread })))
const FeaturesGrid = dynamic(() => import('@/features/marketing/FeaturesGrid').then(m => ({ default: m.FeaturesGrid })))
const TestimonialSection = dynamic(() => import('@/features/marketing/TestimonialSection').then(m => ({ default: m.TestimonialSection })))
const PricingSection = dynamic(() => import('@/features/marketing/PricingSection').then(m => ({ default: m.PricingSection })))
const FAQSection = dynamic(() => import('@/features/marketing/FAQSection').then(m => ({ default: m.FAQSection })))
const FinalCTA = dynamic(() => import('@/features/marketing/FinalCTA').then(m => ({ default: m.FinalCTA })))

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <LogoBar />
      <HowItWorks />
      <SampleSpread />
      <FeaturesGrid />
      <TestimonialSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
    </>
  )
}

export default HomePage
```

- [ ] **Step 3: Verify build and dev server**

Run: `pnpm build`
Expected: Build succeeds, all pages render.

Run: `pnpm dev` and open `http://localhost:3000`
Expected: Full marketing page renders with all sections, no raw text, no inline styles.

- [ ] **Step 4: Commit**

```bash
git add src/app/\\[locale\\]/\\(marketing\\)/layout.tsx src/app/\\[locale\\]/\\(marketing\\)/page.tsx
git commit -m "feat: wire up marketing landing page with lazy-loaded sections"
```
