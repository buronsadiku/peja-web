---
name: react-hook-form-patterns
description: Use this skill when building forms with React Hook Form, Zod validation, i18n error messages, and Zustand sync
type: skill
---

# React Hook Form Patterns

## When to Use
- Building any form with validation
- Creating multi-section forms
- Syncing form state with Zustand stores

## Core Principles
- **React Hook Form** for form state, **Zod** for validation
- Schema co-located with form component
- Translation function passed to schema factory for i18n errors
- `mode: 'onTouched'` + `reValidateMode: 'onChange'`

## Code Templates

### Form with validation

```typescript
// src/features/auth/LoginForm.tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { getLoginSchema, type LoginFields } from './loginSchema'

export function LoginForm() {
  const t = useTranslations()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFields>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(getLoginSchema(t)),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit" disabled={isSubmitting}>
        {t('auth__login__submit')}
      </button>
    </form>
  )
}
```

### Schema with i18n

```typescript
// src/features/auth/loginSchema.ts
import { z } from 'zod'

type T = (key: string, params?: Record<string, unknown>) => string

export const getLoginSchema = (t: T) =>
  z.object({
    email: z.string().min(1, t('validation__required')).email(t('validation__email_invalid')),
    password: z.string().min(8, t('validation__min_length', { length: 8 })),
  })

export type LoginFields = z.infer<ReturnType<typeof getLoginSchema>>
```

### Form synced with Zustand (debounce for live preview)

```typescript
const title = form.watch('title')

useEffect(() => {
  const timeout = setTimeout(() => {
    useEditorStore.getState().setTitle(title)
  }, 300)
  return () => clearTimeout(timeout)
}, [title])
```

Without debouncing, every keystroke writes to the store — expensive if it triggers re-renders in preview components.

### Multi-section form validity tracking

```typescript
// src/lib/stores/formValidityStore.ts
import { create } from 'zustand'

type FormValidityState = {
  sections: Record<string, boolean>
  setSectionValidity: (id: string, valid: boolean) => void
  isAllValid: () => boolean
  reset: () => void
}

export const useFormValidityStore = create<FormValidityState>((set, get) => ({
  sections: {},
  setSectionValidity: (id, valid) =>
    set((s) => ({ sections: { ...s.sections, [id]: valid } })),
  isAllValid: () => Object.values(get().sections).every(Boolean),
  reset: () => set({ sections: {} }),
}))

// In each form section:
const { isValid } = form.formState
useEffect(() => {
  useFormValidityStore.getState().setSectionValidity('details', isValid)
}, [isValid])
```

### Conditional validation (Zod)

```typescript
export const getAddressSchema = (t: T) =>
  z.discriminatedUnion('type', [
    z.object({
      type: z.literal('url'),
      url: z.string().min(1, t('validation__required')).url(t('validation__url_invalid')),
    }),
    z.object({
      type: z.literal('manual'),
      street: z.string().min(1, t('validation__required')),
      city: z.string().min(1, t('validation__required')),
    }),
  ])
```

## Conventions
- Schema factories: `get<Feature>Schema(t)` — accept translation function
- Types inferred from schema: `z.infer<ReturnType<typeof getSchema>>`
- Schema files co-located with form component
- Validate on blur, re-validate on change

## Anti-patterns
- Never define validation inline in JSX — use schema objects
- Never hardcode error messages — use translation function
- Never create a global form store — each form owns its state via RHF
