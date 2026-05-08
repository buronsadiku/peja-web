# Dark Mode Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a three-way theme toggle (light / dark / system) with no flash of wrong theme on page load.

**Architecture:** Zustand store persisted to localStorage drives the theme state. An inline script in `<head>` prevents FOUC by applying the `.dark` class before React hydrates. A toggle component cycles through the three modes. The existing `.dark` CSS variables in globals.css handle all color switching.

**Tech Stack:** Zustand (new dep), React 19, Tailwind CSS v4, `@peja/ui`, `@peja/icons`

---

### Task 1: Install zustand

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install zustand**

Run: `pnpm add zustand`

- [ ] **Step 2: Verify installation**

Run: `pnpm ls zustand`
Expected: `zustand` listed in dependencies

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add zustand dependency"
```

---

### Task 2: Create icon components

**Files:**
- Create: `packages/icons/src/Sun.tsx`
- Create: `packages/icons/src/Moon.tsx`
- Create: `packages/icons/src/Monitor.tsx`

- [ ] **Step 1: Create Sun icon**

```tsx
// packages/icons/src/Sun.tsx
export function Sun(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx={12} cy={12} r={4} />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}
```

- [ ] **Step 2: Create Moon icon**

```tsx
// packages/icons/src/Moon.tsx
export function Moon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}
```

- [ ] **Step 3: Create Monitor icon**

```tsx
// packages/icons/src/Monitor.tsx
export function Monitor(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width={20} height={14} x={2} y={3} rx={2} />
      <line x1={8} x2={16} y1={21} y2={21} />
      <line x1={12} x2={12} y1={17} y2={21} />
    </svg>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add packages/icons/src/Sun.tsx packages/icons/src/Moon.tsx packages/icons/src/Monitor.tsx
git commit -m "feat: add Sun, Moon, Monitor icon components"
```

---

### Task 3: Create theme store

**Files:**
- Create: `packages/ui/src/utils/useThemeStore.ts`

- [ ] **Step 1: Create the store**

```ts
// packages/ui/src/utils/useThemeStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

type ThemeState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  cycleTheme: () => void
}

const CYCLE_ORDER: Theme[] = ['light', 'dark', 'system']

function resolveIsDark(theme: Theme): boolean {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyThemeToDOM(theme: Theme) {
  if (typeof document === 'undefined') return
  const isDark = resolveIsDark(theme)
  document.documentElement.classList.toggle('dark', isDark)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',

      setTheme: (theme) => {
        set({ theme })
        applyThemeToDOM(theme)
      },

      cycleTheme: () => {
        const currentIndex = CYCLE_ORDER.indexOf(get().theme)
        const nextTheme = CYCLE_ORDER[(currentIndex + 1) % CYCLE_ORDER.length]
        get().setTheme(nextTheme)
      },
    }),
    {
      name: 'theme',
      onRehydrate: () => (state) => {
        if (state) applyThemeToDOM(state.theme)
      },
    },
  ),
)

if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const { theme } = useThemeStore.getState()
    if (theme === 'system') applyThemeToDOM('system')
  })
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit --project packages/ui/tsconfig.json`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/utils/useThemeStore.ts
git commit -m "feat: add theme store with light/dark/system support"
```

---

### Task 4: Create ThemeToggle component

**Files:**
- Create: `packages/ui/src/components/ThemeToggle.tsx`

- [ ] **Step 1: Create the component**

```tsx
// packages/ui/src/components/ThemeToggle.tsx
'use client'

import { useEffect, useState } from 'react'
import { useThemeStore } from '../utils/useThemeStore'
import { cn } from '../utils/cn'

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useThemeStore((s) => s.theme)
  const cycleTheme = useThemeStore((s) => s.cycleTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className={cn(
          'inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition',
          className,
        )}
        aria-label="Toggle theme"
      >
        <span className="size-5" />
      </button>
    )
  }

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition',
        className,
      )}
      aria-label={`Current theme: ${theme}. Click to switch.`}
    >
      {theme === 'light' && <SunIcon className="size-5" />}
      {theme === 'dark' && <MoonIcon className="size-5" />}
      {theme === 'system' && <MonitorIcon className="size-5" />}
    </button>
  )
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx={12} cy={12} r={4} />
      <path d="M12 2v2" /><path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" /><path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

function MonitorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width={20} height={14} x={2} y={3} rx={2} />
      <line x1={8} x2={16} y1={21} y2={21} />
      <line x1={12} x2={12} y1={17} y2={21} />
    </svg>
  )
}
```

Note: Icons are inlined in this component to keep it self-contained within `@peja/ui`. The `packages/icons/` versions (Task 2) are available for use elsewhere in the app.

- [ ] **Step 2: Commit**

```bash
git add packages/ui/src/components/ThemeToggle.tsx
git commit -m "feat: add ThemeToggle component with light/dark/system cycling"
```

---

### Task 5: Add FOUC-prevention script to locale layout

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Add the inline theme script**

Replace the current `src/app/[locale]/layout.tsx` with:

```tsx
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { AppProviders } from '@/features/layout/AppProviders'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const themeScript = `(function(){
  try {
    var d = document.documentElement;
    var t = JSON.parse(localStorage.getItem('theme') || '{}');
    var v = t && t.state && t.state.theme;
    if (v === 'dark' || (v !== 'light' && matchMedia('(prefers-color-scheme:dark)').matches)) {
      d.classList.add('dark');
    }
  } catch(e) {}
})()`

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
    <html lang={locale} className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider messages={messages}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

Key changes from current:
- Added `suppressHydrationWarning` on `<html>` (the script adds `dark` class before hydration)
- Added `<head>` with inline script that reads Zustand's persisted state format (`{"state":{"theme":"dark"}}`)
- Removed `bg-background text-foreground` from body (now handled by `@layer base` in globals.css)

- [ ] **Step 2: Verify dev server starts**

Run: `pnpm dev`
Expected: App loads without errors. Page shows light theme by default.

- [ ] **Step 3: Commit**

```bash
git add src/app/\\[locale\\]/layout.tsx
git commit -m "feat: add inline theme script to prevent FOUC"
```

---

### Task 6: Verify end-to-end

- [ ] **Step 1: Start dev server and test in browser**

Run: `pnpm dev`

Open `http://localhost:3000` in browser. Add `<ThemeToggle />` temporarily to any visible page or layout to test:

```tsx
// Temporarily in src/app/[locale]/(marketing)/layout.tsx or similar
import { ThemeToggle } from '@peja/ui/components/ThemeToggle'

// Add <ThemeToggle /> somewhere visible in the JSX
```

- [ ] **Step 2: Verify toggle cycling**

Click the toggle button. It should cycle: Sun (light) -> Moon (dark) -> Monitor (system) -> Sun (light).

When switching to dark: page background should become dark, text should become light.
When switching to system: should follow OS preference.
When switching to light: back to off-white background, charcoal text.

- [ ] **Step 3: Verify FOUC prevention**

Set theme to dark, then hard refresh (Cmd+Shift+R). The page should load dark immediately with no flash of light theme.

- [ ] **Step 4: Verify localStorage persistence**

Set theme to dark, close and reopen the tab. Theme should still be dark.

- [ ] **Step 5: Clean up temp test code and commit**

Remove the temporary `<ThemeToggle />` import from the layout.

```bash
git add -A
git commit -m "feat: dark mode toggle complete"
```
