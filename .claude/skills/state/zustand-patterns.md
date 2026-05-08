---
name: zustand-patterns
description: Use this skill when setting up Zustand stores — global stores, feature stores, persistence, SSR safety, and server-to-client data sync
type: skill
---

# Zustand State Management

## When to Use
- Setting up global state (user, auth, theme)
- Creating feature-scoped stores (editor, filters)
- Syncing server-fetched data into client-side stores

## Core Principles
- **One store per domain** — not one mega-store
- Global stores: `userStore`, `themeStore` — few, stable
- Feature stores: co-located with their feature in `src/features/<name>/`
- **Server data flows via props** into client components, synced via `useEffect`
- **Never access stores in server components** — stores are client-only

## Code Templates

### Global store

```typescript
// src/lib/stores/userStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UserState = {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
```

### Feature store

```typescript
// src/features/editor/editorStore.ts
import { create } from 'zustand'

const initialState = { title: '', description: '' }

export const useEditorStore = create<EditorState>()((set) => ({
  ...initialState,
  setTitle: (title: string) => set({ title }),
  setDescription: (description: string) => set({ description }),
  reset: () => set(initialState),
}))
```

### Server-to-client sync

```typescript
// src/features/layout/UserSync.tsx
'use client'
import { useEffect } from 'react'
import { useUserStore } from '@/lib/stores/userStore'

export function UserSync({ user }: { user: User }) {
  const setUser = useUserStore((s) => s.setUser)
  useEffect(() => { setUser(user) }, [user, setUser])
  return null
}
```

### Imperative access (outside React)

```typescript
useUserStore.getState().clearUser()
```

## Hydration Mismatch

Persisted stores cause hydration warnings because localStorage isn't available during SSR. Two approaches:

```typescript
// Option 1: skipHydration + manual rehydrate
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({ /* ... */ }),
    { name: 'user-storage', skipHydration: true },
  ),
)
// In a client component:
useEffect(() => { useUserStore.persist.rehydrate() }, [])

// Option 2: Suppress with a mounted check
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return null // or skeleton
```

## Store Organization

```
src/lib/stores/              # Global stores
├── userStore.ts
└── themeStore.ts

src/features/editor/          # Feature-scoped
├── editorStore.ts
└── editorSelectors.ts
```

## Conventions
- Store files: `<domain>Store.ts`
- Actions inside store definition
- `partialize` in persist — only persist what's needed
- `getState()` for imperative access outside React

## Anti-patterns
- Never create one giant store
- Never access `useXStore()` in server components
- Never call `getState()` during render — use the hook
- Never persist derived state — derive it from persisted state
