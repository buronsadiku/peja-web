---
name: tailwind-design-system
description: Use this skill when working with Tailwind CSS v4, shadcn/ui component patterns, the full theme token set (colors, breakpoints, radius, shadows, spacing, animations, typography, gradients), cn() utility, and cva components
type: skill
---

# Tailwind CSS v4 + shadcn/ui Design System

## When to Use
- Adding or modifying design tokens (colors, typography, spacing, shadows, radius)
- Building new UI components
- Implementing dark mode
- Adding shadcn/ui components or customizing existing ones
- Using breakpoints, animations, gradients, or custom utilities

## Core Principles
- **shadcn/ui pattern** — components use Radix UI primitives + cva + cn(), live in `packages/ui/`
- **Tailwind v4 uses CSS, not JS** — no `tailwind.config.ts`, theme defined via `@theme inline` in CSS
- **Full token set** — oklch colors, numeric radius, semantic shadows, named breakpoints, animations
- **NEVER use raw Tailwind values** — always use theme tokens for colors, text sizes, radius, shadows
- `cn()` wraps `clsx` + `tailwind-merge` — always use it, never raw className concatenation
- `@utility` for composite classes (typography, gradients, scrollbar) — replaces `@layer utilities`

## UI Package Location

```
packages/ui/
├── package.json              # @peja/ui — workspace package
├── tsconfig.json
└── src/
    ├── components/           # shadcn/ui-style components
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   └── ...
    └── utils/
        └── cn.ts             # clsx + tailwind-merge
```

Import from app code:
```typescript
import { Button } from '@peja/ui/components/Button'
import { cn } from '@peja/ui/utils/cn'
```

## Complete Token Reference

### Colors (semantic, via CSS vars)

| Token | Tailwind class | Use for |
|-------|---------------|---------|
| `background` / `foreground` | `bg-background`, `text-foreground` | Page backgrounds, body text |
| `card` / `card-foreground` | `bg-card`, `text-card-foreground` | Card surfaces |
| `popover` / `popover-foreground` | `bg-popover`, `text-popover-foreground` | Dropdowns, popovers |
| `primary` / `primary-foreground` | `bg-primary`, `text-primary-foreground` | CTAs, links (Cornflower #779FEB) |
| `secondary` / `secondary-foreground` | `bg-secondary`, `text-secondary-foreground` | Success, positive (Jade #82E19D) |
| `accent` / `accent-foreground` | `bg-accent`, `text-accent-foreground` | Premium, special (Kernel #EDB974) |
| `muted` / `muted-foreground` | `bg-muted`, `text-muted-foreground` | Subtle backgrounds, secondary text |
| `destructive` | `bg-destructive` | Alerts, warnings (Peachy #EC8662) |
| `danger` | `bg-danger` | Delete, destructive actions (#E55353) |
| `border` | `border-border` | Borders, dividers |
| `input` | `border-input` | Input borders |
| `ring` | `ring-ring` | Focus rings |
| `warm-cream` / `warm-panel` | `bg-warm-cream`, `bg-warm-panel` | Warm surface tints |
| `sidebar-*` | `bg-sidebar`, etc. | Sidebar-specific tokens |
| `chart-1` through `chart-5` | `bg-chart-1`, etc. | Data visualization |

### Breakpoints

| Name | Value | Tailwind prefix |
|------|-------|-----------------|
| `mobile` | 390px | `mobile:` |
| `tablet` | 740px | `tablet:` |
| `desktop` | 1220px | `desktop:` |
| `large-desktop` | 1800px | `large-desktop:` |

```tsx
<div className="px-4 tablet:px-8 desktop:px-20 large-desktop:px-0">
  <h1 className="type-h2 tablet:type-h1 desktop:type-display">Responsive</h1>
</div>
```

### Border Radius

| Token | Value | Tailwind class |
|-------|-------|----------------|
| `none` | 0 | `rounded-none` |
| `4` | 0.25rem (4px) | `rounded-4` |
| `6` | 0.375rem (6px) | `rounded-6` |
| `8` | 0.5rem (8px) | `rounded-8` |
| `10` | 0.625rem (10px) | `rounded-10` |
| `12` | 0.75rem (12px) | `rounded-12` |
| `16` | 1rem (16px) | `rounded-16` |
| `20` | 1.25rem (20px) | `rounded-20` |
| `24` | 1.5rem (24px) | `rounded-24` |
| `full` | pill shape | `rounded-full` |

```tsx
<div className="rounded-12 bg-card p-6">Card with 12px radius</div>
<button className="rounded-8 bg-primary px-4 py-2">Button</button>
<span className="rounded-full bg-secondary px-3 py-1">Badge</span>
```

### Shadows

| Token | Tailwind class | Use for |
|-------|----------------|---------|
| `shadow` | `shadow` | Default card/panel shadow |
| `shadow-sm` | `shadow-sm` | Subtle elevation (badges, chips) |
| `shadow-md` | `shadow-md` | Medium elevation (dropdowns) |
| `shadow-lg` | `shadow-lg` | High elevation (modals, dialogs) |
| `shadow-icon` | `shadow-icon` | Icon button elevation |
| `shadow-input` | `shadow-input` | Focused input glow (primary-tinted) |
| `shadow-none` | `shadow-none` | Remove shadow |

### Drop Shadows

| Token | Tailwind class | Use for |
|-------|----------------|---------|
| `drop-shadow` | `drop-shadow` | Default drop shadow (for non-box elements) |
| `drop-shadow-sm` | `drop-shadow-sm` | Subtle drop shadow |
| `drop-shadow-icon` | `drop-shadow-icon` | Icon drop shadow |

### Extended Spacing

All default Tailwind spacing works. These extend it with half-step and large values:

| Token | Value | Tailwind class |
|-------|-------|----------------|
| `4.5` | 1.125rem | `p-4_5`, `gap-4_5` |
| `6.5` | 1.625rem | `p-6_5`, `gap-6_5` |
| `7.5` | 1.875rem | `p-7_5`, `gap-7_5` |
| `8.5` | 2.125rem | `p-8_5`, `gap-8_5` |
| `11.5` | 2.875rem | `p-11_5` |
| `13` | 3.25rem | `p-13` |
| `15` | 3.75rem | `p-15`, `gap-15` |
| `17` | 4.25rem | `p-17` |
| `18` | 4.5rem | `p-18` |
| `21` | 5.25rem | `p-21` |
| `22` | 5.5rem | `p-22` |
| `25` | 6.25rem | `p-25` |
| `26` | 6.5rem | `p-26` |
| `30` | 7.5rem | `py-30` |
| `45` | 11.25rem | `h-45` |
| `50` | 12.5rem | `h-50` |
| `75` | 18.75rem | `w-75` |
| `100` | 25rem | `max-w-100` |
| `safe-area-bottom` | env() | `pb-safe-area-bottom` |

### Animations

| Token | Tailwind class | Use for |
|-------|----------------|---------|
| `fade-in` | `animate-fade-in` | Elements appearing |
| `fade-out` | `animate-fade-out` | Elements disappearing |
| `slide-up` | `animate-slide-up` | Content sliding up into view |
| `slide-down` | `animate-slide-down` | Content sliding down into view |
| `accordion-down` | `animate-accordion-down` | Radix Accordion open |
| `accordion-up` | `animate-accordion-up` | Radix Accordion close |
| `collapsible-down` | `animate-collapsible-down` | Radix Collapsible open |
| `collapsible-up` | `animate-collapsible-up` | Radix Collapsible close |
| `pulse-shadow` | `animate-pulse-shadow` | Recording/live indicator glow |

```tsx
<DialogPrimitive.Overlay className="animate-fade-in" />
<DialogPrimitive.Content className="animate-slide-up" />
<div className="animate-pulse-shadow" style={{ '--pulse-color-1': 'oklch(0.723 0.135 40.0 / 0.4)', '--pulse-color-2': 'oklch(0.723 0.135 40.0 / 0)' }} />
```

## Typography Scale

Semantic typography utilities defined via `@utility` in `globals.css`. **Always use these instead of raw `text-sm`, `text-lg`, `text-[17px]`**, etc.

Headings use CSS variables for responsive sizing (override `--font-size-heading-*` per breakpoint).

| Utility | Size | Line height | Weight | Use for |
|---------|------|-------------|--------|---------|
| `type-display` | 60px | 1 | 700 | Hero headlines, landing pages |
| `type-h1` | var (32px) | var (40px) | 700 | Page titles |
| `type-h2` | var (24px) | var (32px) | 600 | Section headings |
| `type-h3` | var (20px) | var (28px) | 600 | Card titles, subsections |
| `type-h4` | var (16px) | var (24px) | 600 | Sidebar headings, dialogs |
| `type-body-large` | 18px | 26px | 400 | Lead paragraphs, feature descriptions |
| `type-body` | 16px | 24px | 400 | Default body text |
| `type-body-small` | 14px | 22px | 400 | Secondary text, table cells |
| `type-caption` | 12px | 20px | 400 | Timestamps, helper text, badges |
| `type-overline` | 11px | 16px | 600 | Section labels (auto-uppercased) |
| `type-button-small` | 14px | 22px | 500 | Small button text |
| `type-button-large` | 18px | 26px | 600 | Large button text |

### Usage

```tsx
<h1 className="type-h1 text-foreground">Page Title</h1>
<p className="type-body text-muted-foreground">Body text here.</p>
<span className="type-caption text-muted-foreground">Updated 2 hours ago</span>
<span className="type-overline text-primary">New Feature</span>

// Combine with font-family when needed
<h1 className="type-display font-serif text-foreground">Hero</h1>

// Override weight when needed
<p className="type-body-small font-medium text-foreground">Label text</p>

// Button typography in cva
size: {
  default: 'h-10 gap-2 px-4 type-button-small',
  large: 'h-12 gap-2 px-6 type-button-large',
}
```

### Rules
- **NEVER use raw `text-sm`, `text-xs`, `text-lg`, `text-[17px]`** — always use `type-*` utilities
- Typography utilities set `font-size`, `line-height`, `letter-spacing`, and `font-weight`
- Override `font-weight` with `font-medium`, `font-semibold`, etc. when the default doesn't fit
- `type-overline` includes `text-transform: uppercase` — don't add `uppercase` separately
- Pair with color tokens: `type-body text-foreground`, `type-caption text-muted-foreground`
- Responsive overrides work normally: `type-body tablet:type-body-large`

## Gradient Utilities

| Utility | Direction | Description |
|---------|-----------|-------------|
| `gradient-cream-v` | top → bottom | White to off-white (background) |
| `gradient-cream-to-transparent-v` | top → bottom | Off-white fading to transparent |
| `gradient-transparent-to-cream-v` | bottom → top | Transparent to off-white |
| `gradient-primary-v` | top → bottom | White to light primary tint |
| `gradient-warm-v` | top → bottom | Off-white → warm-cream → light primary |

```tsx
<section className="gradient-warm-v py-30">Hero section with warm gradient</section>
<div className="gradient-cream-to-transparent-v h-20">Fade-out overlay</div>
```

## Custom Utilities

| Utility | Use for |
|---------|---------|
| `hide-scrollbar` | Hide scrollbar on scrollable containers (cross-browser) |

```tsx
<div className="hide-scrollbar overflow-x-auto">
  <div className="flex gap-4">{/* horizontal scroll, no visible scrollbar */}</div>
</div>
```

## Custom Variants

Tailwind v4 uses `@custom-variant` instead of plugin-based variants. Define them in `globals.css`.

### Existing variants

```css
@custom-variant dark (&:is(.dark *));
```

### Adding new custom variants

```css
/* State-based variants */
@custom-variant loading (&:is([data-loading="true"] *));
@custom-variant error (&:is([data-error="true"] *));

/* Layout-based variants */
@custom-variant sidebar-open (&:is([data-sidebar="open"] *));
@custom-variant sidebar-collapsed (&:is([data-sidebar="collapsed"] *));

/* Media query variants */
@custom-variant touch (@media (pointer: coarse));
@custom-variant hover-supported (@media (hover: hover));
@custom-variant print (@media print);
@custom-variant motion-safe (@media (prefers-reduced-motion: no-preference));
@custom-variant motion-reduce (@media (prefers-reduced-motion: reduce));
```

### When to use custom variants vs conditional classes

| Scenario | Use |
|----------|-----|
| Parent state affects multiple children | `@custom-variant` + data attribute |
| Single element conditional style | `cn()` with ternary |
| Media/device capability | `@custom-variant` with `@media` |
| Component visual variant | `cva()` |

## Adding New Tokens

**Colors** — add in three places:
1. `@theme inline { --color-new-token: var(--new-token); }`
2. `:root { --new-token: oklch(...); }`
3. `.dark { --new-token: oklch(...); }`

**Other tokens** (radius, spacing, shadows, breakpoints, animations) — add directly in `@theme inline { }`:
```css
@theme inline {
  --radius-28: 1.75rem;
  --spacing-32: 8rem;
  --shadow-xl: 0px 8px 48px oklch(0.35 0.01 260 / 0.20);
  --animate-bounce-in: bounce-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## cn() Utility

```typescript
// packages/ui/src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Adding New shadcn/ui Components

1. Check [ui.shadcn.com](https://ui.shadcn.com) for the component
2. Copy the component code into `packages/ui/src/components/<Component>.tsx`
3. Update imports: `cn` from `../utils/cn` (relative, not `@/`)
4. Replace `text-white` with `text-primary-foreground` etc. — use theme tokens
5. Use `rounded-8`, `rounded-12` etc. — use numeric radius tokens
6. Use `shadow`, `shadow-sm`, etc. — use semantic shadow tokens
7. Use `animate-fade-in`, `animate-slide-up` — use animation tokens
8. Install any missing Radix primitives: `pnpm add @radix-ui/react-<primitive>`

### Example: Dialog with full token usage

```typescript
// packages/ui/src/components/Dialog.tsx
'use client'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '../utils/cn'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger

export const DialogContent = ({
  className,
  children,
  ...props
}: DialogPrimitive.DialogContentProps) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay
      className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out"
    />
    <DialogPrimitive.Content
      className={cn(
        'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
        'rounded-12 bg-popover p-6 shadow-lg border border-border text-popover-foreground',
        'data-[state=open]:animate-slide-up data-[state=closed]:animate-fade-out',
        className,
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
)

export const DialogTitle = ({ className, ...props }: DialogPrimitive.DialogTitleProps) => (
  <DialogPrimitive.Title className={cn('type-h4', className)} {...props} />
)
```

## CSS Class Patterns

```
/* Layout */        flex flex-col items-center justify-center gap-4
/* Typography */    type-h2 type-body text-foreground text-muted-foreground
/* Colors */        bg-background bg-card bg-primary text-primary-foreground
/* States */        hover:bg-primary/90 focus:ring-2 focus:ring-ring disabled:opacity-50
/* Border */        rounded-8 rounded-12 border border-border
/* Shadows */       shadow shadow-sm shadow-lg shadow-input
/* Responsive */    mobile:px-4 tablet:px-8 desktop:px-20
/* Animation */     animate-fade-in animate-slide-up transition duration-200
/* Gradient */      gradient-warm-v gradient-cream-v
/* Custom */        hide-scrollbar
```

## Installed Dependencies

| Package | Purpose |
|---------|---------|
| `tailwindcss` v4 | CSS framework |
| `@tailwindcss/postcss` | PostCSS plugin |
| `shadcn` | Base CSS (keyframes, Radix variants, scrollbar utility) |
| `class-variance-authority` | Component variants (cva) |
| `clsx` | Conditional class names |
| `tailwind-merge` | Smart class merging |
| `@radix-ui/react-slot` | Polymorphic `asChild` pattern |

## Conventions
- **NEVER use raw Tailwind colors** — no `text-zinc-50`, `bg-slate-900`, `text-gray-500`. Always use theme tokens
- **NEVER use raw Tailwind text sizes** — no `text-sm`, `text-xs`, `text-lg`, `text-[17px]`. Always use `type-*` utilities
- **NEVER use raw Tailwind radius** — no `rounded-sm`, `rounded-lg`. Always use numeric tokens: `rounded-8`, `rounded-12`
- **NEVER use raw Tailwind shadows** — no default `shadow-md`. Always use semantic tokens: `shadow`, `shadow-sm`, `shadow-lg`
- **NEVER use default breakpoints** — no `sm:`, `md:`, `lg:`, `xl:`. Always use named: `mobile:`, `tablet:`, `desktop:`
- Always use `cn()` — never concatenate class strings
- `cva` for any component with 2+ visual variants
- `@utility` for new composite classes — never `@layer utilities`
- UI components live in `packages/ui/src/components/` — one file per component
- Components use relative imports (`../utils/cn`), not `@/` aliases
- All colors use oklch in the CSS variables
- Responsive breakpoints: `mobile` < `tablet` < `desktop` < `large-desktop`

## Anti-patterns
- **NEVER use `text-zinc-*`, `bg-slate-*`, `text-gray-*` or any raw color** — use theme tokens only
- **NEVER use `text-sm`, `text-xs`, `text-lg`, `text-[17px]` or any raw text size** — use `type-*` utilities only
- **NEVER use `rounded-sm`, `rounded-md`, `rounded-lg`** — use `rounded-8`, `rounded-12`, etc.
- **NEVER use `sm:`, `md:`, `lg:`, `xl:`, `2xl:`** — use `mobile:`, `tablet:`, `desktop:`, `large-desktop:`
- Never create a `tailwind.config.ts` — Tailwind v4 uses CSS-based config
- Never hardcode hex/rgb in className — use CSS variable tokens
- Never use `dark:` prefix for colors defined as CSS variables — they switch automatically
- Never put UI components in `src/features/ui/` — they live in `packages/ui/`
- Never install shadcn CLI — copy components manually and adapt
- Never use `@layer utilities { }` — use `@utility name { }` (Tailwind v4 syntax)
- Never use `@apply` for new utilities — use `@utility` instead
