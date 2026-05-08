# Dark Mode Toggle

Three-way theme toggle: light / dark / system.

## Architecture

### State
- Zustand store in `packages/ui/src/utils/useThemeStore.ts`
- Persisted to localStorage under key `theme`
- Values: `light` | `dark` | `system`
- `applyTheme()` reads the current value and toggles `.dark` on `<html>`
- `system` resolves via `matchMedia('(prefers-color-scheme: dark)')`

### FOUC Prevention
- Inline `<script>` in `<head>` of `src/app/[locale]/layout.tsx`
- Reads `localStorage.getItem("theme")` before React hydrates
- Applies `.dark` class to `<html>` if dark mode is active
- Runs synchronously — no flash of wrong theme

### Toggle Component
- `packages/ui/src/components/ThemeToggle.tsx`
- Cycles: light -> dark -> system -> light
- Icons: Sun (light), Moon (dark), Monitor (system)
- Uses `@peja/icons` for the three SVG icons

### Icons
- `packages/icons/src/Sun.tsx`
- `packages/icons/src/Moon.tsx`
- `packages/icons/src/Monitor.tsx`

## Files

| Action | Path |
|--------|------|
| Create | `packages/ui/src/utils/useThemeStore.ts` |
| Create | `packages/ui/src/components/ThemeToggle.tsx` |
| Create | `packages/icons/src/Sun.tsx` |
| Create | `packages/icons/src/Moon.tsx` |
| Create | `packages/icons/src/Monitor.tsx` |
| Modify | `src/app/[locale]/layout.tsx` — add theme script to `<head>` |

No changes to globals.css — dark tokens and `@custom-variant dark` already exist.
