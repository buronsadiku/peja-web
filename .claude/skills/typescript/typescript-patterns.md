---
name: typescript-patterns
description: Use this skill when writing TypeScript in a Next.js project — type naming conventions, prop patterns, schema inference, generics, utility types, module augmentation, and type organization
type: skill
---

# TypeScript Patterns

## When to Use
- Writing any new TypeScript code (components, hooks, stores, API clients, utils)
- Deciding where to put types and how to name them
- Typing API responses, form schemas, component props, or generic utilities
- Adding module augmentations for third-party libraries

## Core Principles
- **`T` prefix** for all custom types (`TUser`, `TApiResponse`) — interfaces use `I` only when extending
- **Infer types from schemas** — never duplicate what Yup/Zod already defines
- **Co-locate types with features** — global types only for truly cross-cutting concerns
- **`as const satisfies`** for literal objects that need both inference and type checking
- **Inline props for simple components**, named types for complex/shared ones

## Type Naming Conventions

| Kind | Convention | Example |
|------|-----------|---------|
| Types | `T` prefix, PascalCase | `TUser`, `TQrData`, `TApiResponse` |
| Props (simple) | Inline object | `({ title }: { title: string })` |
| Props (complex) | Named type, no export | `type Props = { ... }` |
| Props (shared) | Exported type | `export type TCardProps = { ... }` |
| Enums | PascalCase + SCREAMING members | `enum Status { ACTIVE = 'active' }` |
| Constants | SCREAMING_SNAKE | `MAX_FILE_SIZE`, `AUTH_TOKEN_COOKIE` |
| Const objects | PascalCase + `as const` | `const ROUTES = { ... } as const` |
| Generics | Single uppercase or descriptive | `<T>`, `<TContent extends TBase>` |

## Type Definition Locations

```
src/
├── types/                      # Global cross-cutting types ONLY
│   ├── index.ts                # DefaultApiResponse, PaymentOptions
│   ├── auth.ts                 # User, JWTokens
│   ├── subscription.ts         # SubscriptionStatus enum, billing types
│   └── analytics.ts            # Chart data types (generic mapped)
│
└── features/
    └── editor/
        ├── editorTypes.ts      # Feature-specific types (co-located)
        ├── editorStore.ts      # Types inline with store
        └── EditorForm/
            └── editorSchema.ts # Form types inferred from Yup/Zod
```

**Rule:** If a type is used in 2+ features → `src/types/`. Used in one feature → co-locate.

## Code Templates

### Component prop patterns

```typescript
// Simple component — inline props
export const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={cn('rounded-full px-2 py-1', color)}>{label}</span>
)

// Complex component — named type (not exported unless shared)
type Props = {
  title: string
  description?: string
  icon?: React.ReactElement<SVGSVGElement>
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4'
  className?: string
  children: React.ReactNode
}

export const FeatureCard = ({ title, description, icon, headingLevel = 'h3', className, children }: Props) => {
  const Heading = headingLevel
  return (
    <div className={cn('rounded-12 bg-background p-6', className)}>
      <Heading>{title}</Heading>
      {description && <p>{description}</p>}
      {children}
    </div>
  )
}

// Shared/exported props — when other components need the type
export type TFileUploadProps = {
  files: File[]
  progress: number
  onFileUpload: (file: File) => void
  onFileDelete: (file: File, index: number) => void
  maxFiles?: number
  accept?: string[]
}

// Extending HTML attributes
export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  leftIcon?: React.ComponentType<{ className?: string }>
}

// Extending base props with Omit + intersection
export type TMediaUploadProps = Omit<
  TFileUploadProps,
  'onFileUpload' | 'files' | 'progress'
> & {
  initialFileList?: File[]
  onUploadComplete: (media: TUploadedMedia, file: File, index: number) => void
  onUploadStart?: (file: File) => void
}
```

### Schema type inference (Yup)

```typescript
// src/features/editor/editorSchema.ts
import * as yup from 'yup'
import type { InferType } from 'yup'

type TTranslationFn = (key: string, params?: Record<string, unknown>) => string

export const getEditorSchema = (t: TTranslationFn) =>
  yup.object({
    title: yup.string()
      .required(t('validation__required'))
      .max(100, t('validation__max_length', { length: 100 })),
    description: yup.string()
      .max(500, t('validation__max_length', { length: 500 })),
    tags: yup.array(
      yup.object({
        label: yup.string().required(),
        value: yup.string().required(),
      }),
    ).required(),
  })

// Infer the form type from the schema — single source of truth
export type TEditorFields = InferType<ReturnType<typeof getEditorSchema>>

// Extract nested types from inferred schema
export type TTag = TEditorFields['tags'][number]
```

### Schema type inference (Zod)

```typescript
// src/features/editor/editorSchema.ts
import { z } from 'zod'

export const getEditorSchema = (t: TTranslationFn) =>
  z.object({
    title: z.string().min(1, t('validation__required')).max(100),
    description: z.string().max(500).optional(),
    tags: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })),
  })

export type TEditorFields = z.infer<ReturnType<typeof getEditorSchema>>
```

### Generic API types

```typescript
// src/services/api/types.ts
export type TApiResponse<T> = {
  data: T
  message?: string
  status: number
}

// Generic API methods with constraints
export type TItemData<T extends TItemContent = TItemContent> = {
  id: string
  content: T
  design: TDesign | null
  uri: string
  name: string
  createdAt: string
}

export type TRequiredItemData<T extends TItemContent> = Pick<
  TItemData<T>,
  'name' | 'content' | 'design'
>

export type TCreateItemResponse = Pick<TItemData, 'id' | 'uri'>

// Usage in API client
const getItem = <T extends TItemContent>(id: string) =>
  getApiClient().get<TItemData<T>>(`/items/${id}`)

const createItem = <T extends TItemContent>(
  data: TRequiredItemData<T>,
  signal?: AbortSignal,
) =>
  getApiClient().post<TCreateItemResponse>('/items', data, { signal })
```

### Inline API response typing

```typescript
// When response shape is unique to one endpoint — type inline
const activate2FA = () =>
  getApiClient().get<{
    img: string
    userId: string
    secret: string
  }>('/auth/activate-2fa')

// When response shape is reused — extract to named type
export type TLoginResponse = {
  accessToken: string
  user: TUser
}

const login = (credentials: TLoginCredentials) =>
  getApiClient().post<TLoginResponse>('/auth/login', credentials)
```

### Enum patterns

```typescript
// String enum — for values that appear in API payloads
export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

// Const enum — for internal-only values (inlined at compile time)
export const enum SearchParam {
  Id = 'id',
  Tab = 'tab',
  Mode = 'mode',
}

// Union type — for simple string literals (lighter than enum)
export type TAddressType = 'manual' | 'url'
export type TTheme = 'light' | 'dark' | 'system'

// Const object with derived type — for objects that need runtime access
export const SUPPORTED_FORMATS = ['png', 'svg', 'jpeg'] as const
export type TFormat = (typeof SUPPORTED_FORMATS)[number]  // 'png' | 'svg' | 'jpeg'
```

### `as const satisfies` pattern

```typescript
// Route map — inferred as literal types but validated against Record shape
export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  settings: '/settings',
  billing: '/billing',
} as const satisfies Record<string, string>

// Step configuration — literal inference with type safety
const STEP_CONFIG = {
  type: ['idle', 'active', 'complete'],
  content: ['idle', 'active', 'complete'],
  design: ['idle', 'active'],
} as const satisfies Record<TStep, readonly TStepState[]>
```

### Utility type compositions

```typescript
// Pick specific fields from a large type
export type TItemSummary = Pick<TItemData, 'id' | 'name' | 'uri' | 'createdAt'>

// Omit fields and add new ones (composition)
export type TItemFormData = Omit<TItemData, 'id' | 'createdAt' | 'uri'> & {
  isDraft: boolean
}

// Partial for update payloads
export type TUpdateItemPayload = Partial<Pick<TItemData, 'name' | 'content' | 'design'>>

// Record for lookup maps
export type TTypeToComponent = Record<TItemType, React.ComponentType>

// Mapped types for data transformations
export type TPieChartData<T extends string> = {
  [K in T]: string
} & {
  count: number
  percentage: number
}

export type TOsChartData = TPieChartData<'os'>
export type TDeviceChartData = TPieChartData<'device'>

// Reverse mapping utility
export type TReverseMapping<T extends Record<string, string>> = {
  [K in keyof T as T[K]]: K
}
```

### Generic hooks

```typescript
// src/hooks/useSyncFieldFromStore.ts
export const useSyncFieldFromStore = <TStore, TValue>({
  store,
  selector,
  setFieldValue,
}: {
  store: UseBoundStore<StoreApi<TStore>>
  selector: (state: TStore) => TValue
  setFieldValue: (value: TValue) => void
}) => {
  const value = store(selector)
  useEffect(() => { setFieldValue(value) }, [value, setFieldValue])
}
```

### Module augmentation

```typescript
// src/types/globals.d.ts

// Extend React CSSProperties for CSS custom properties
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined
  }
}

// Extend Window for third-party scripts
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]  // GTM
    gtag?: (...args: unknown[]) => void
  }

  interface Navigator {
    userAgentData?: {
      mobile: boolean
      platform: string
    }
  }
}

export {} // Required to make this a module

// Extend third-party library types
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}
```

### ForwardRef typing

```typescript
// Component with forwarded ref
import { forwardRef } from 'react'

export type TFormHandle = {
  validate: () => Promise<boolean>
  triggerError: (field: string, message: string) => void
}

export const EditorForm = forwardRef<TFormHandle, TEditorFormProps>(
  ({ initialData, onSubmit }, ref) => {
    useImperativeHandle(ref, () => ({
      validate: () => form.trigger(),
      triggerError: (field, message) => form.setError(field, { message }),
    }))

    return <form>...</form>
  },
)
EditorForm.displayName = 'EditorForm'

// Link component inferring props from another component
export const Link = forwardRef<
  HTMLAnchorElement,
  Parameters<typeof IntlLink>[0]
>((props, ref) => <IntlLink {...props} ref={ref} />)
```

### Type narrowing

```typescript
// Discriminated union via 'type' field
type TContent =
  | { type: 'url'; url: string }
  | { type: 'text'; body: string }
  | { type: 'wifi'; ssid: string; password: string }

const renderContent = (content: TContent) => {
  switch (content.type) {
    case 'url': return <UrlPreview url={content.url} />
    case 'text': return <TextPreview body={content.body} />
    case 'wifi': return <WifiPreview ssid={content.ssid} />
  }
}

// instanceof narrowing for error handling
if (error instanceof AxiosError) {
  const message = (error.response?.data as { errorMessage: string })?.errorMessage
  return message ?? t('error__generic')
}

// Conditional schema validation (Yup lazy)
export const getAddressSchema = (t: TTranslationFn) =>
  yup.object({
    address: yup.lazy((value) =>
      typeof value === 'object' && value?.url?.trim()
        ? getUrlAddressSchema(t)
        : getManualAddressSchema(t),
    ),
  })
```

## Conventions
- `T` prefix on all custom types: `TUser`, `TApiResponse`, `TEditorFields`
- Types inferred from schemas via `InferType` / `z.infer` — never manually duplicated
- Inline props for < 4 fields; named `type Props` for 4+; exported `type T...Props` if shared
- `as const satisfies` for route maps, config objects, step definitions
- `type` keyword on imports: `import { type TUser } from '@/types/auth'`
- No separate `.types.ts` files — co-locate with implementation or put in feature `types.ts`
- Generics constrained: `<T extends TBase>` not bare `<T>` unless truly unconstrained
- `const enum` for compile-time-only values; regular `enum` for runtime values; union types for simple literals

## Anti-patterns to Avoid
- Never duplicate types that can be inferred from schemas — `InferType` is the source of truth
- Never use `any` without an eslint-disable comment and justification
- Never create a monolithic `types/index.ts` with all types — split by domain
- Never use `I` prefix for types that aren't interfaces extending HTML/lib types
- Never use `as` type assertion when a type guard or generic would work
- Never export props types unless another component actually imports them
- Never use `Record<string, any>` — use `Record<string, unknown>` or a specific type

## Verification Checklist
- [ ] All custom types use `T` prefix
- [ ] Form types inferred from validation schemas (not manually defined)
- [ ] No `any` without justification comment
- [ ] Generic functions have proper constraints
- [ ] Module augmentations in `.d.ts` files with `export {}`
- [ ] `as const satisfies` used for typed literal objects
- [ ] API response types match actual API contract
