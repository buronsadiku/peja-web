---
name: no-hardcoded-text
description: Use when writing or modifying ANY component, page, or layout that renders user-facing text — enforces that all strings use translation keys via next-intl, never hardcoded literals
---

# No Hardcoded Text

## Core Rule

**Every user-facing string MUST use a translation key.** No exceptions — buttons, labels, headings, placeholders, tooltips, error messages, aria-labels, alt text, meta descriptions, toast messages, confirmation dialogs. If a human reads it, it goes through `t()`.

## What Counts as User-Facing Text

Any string rendered in the UI or exposed to assistive technology:

- JSX text content: `<h1>Welcome</h1>` — hardcoded
- Attributes: `placeholder="Search..."`, `aria-label="Close"`, `alt="Profile photo"`
- Template literals in JSX: ``{`Hello ${name}`}``
- Conditional strings: `isActive ? "Active" : "Inactive"`
- Toast / notification messages: `toast.success("Event created")`
- Validation messages: `"This field is required"`
- Meta / SEO: `title`, `description` in `generateMetadata`

## What Does NOT Need Translation

- Internal identifiers: `id="main-nav"`, `data-testid="submit-btn"`
- Log messages: `console.log("fetching data")`
- API keys, URLs, technical constants
- CSS class names
- Developer-facing errors that never reach the UI
- Enum values used as keys (not displayed)

## How to Fix Hardcoded Text

### Step 1 — Choose the right key

Follow the flat key convention with `__` separators and snake_case:

```
{scope}__{feature}__{element}
```

Scopes: `auth`, `event`, `common`, `validation`, `seo`, `error`, `marketing`, `guest`, `kiosk`

Examples:

- Button label on event creation page: `event__create__submit_button`
- Placeholder in search input: `common__search_placeholder`
- Error for required field: `validation__field_required`

### Step 2 — Add the key to ALL message files

Add to `messages/en.json` first (source of truth), then to every other locale file (`fr.json`, `nl.json`, `de.json`, `es.json`, `it.json`). Use the English value as a placeholder in non-English files until translated.

### Step 3 — Use `t()` in the component

Server component:

```typescript
import { getTranslations } from 'next-intl/server'

const Page = async () => {
  const t = await getTranslations()
  return <h1>{t('event__create__title')}</h1>
}
```

Client component:

```typescript
'use client'
import { useTranslations } from 'next-intl'

export const CreateButton = () => {
  const t = useTranslations()
  return <button>{t('event__create__submit_button')}</button>
}
```

With interpolation:

```typescript
// en.json: "event__greeting": "Welcome, {name}!"
t("event__greeting", { name: userName });
```

With HTML (rich text):

```typescript
// en.json: "marketing__hero__subtitle": "The <bold>easiest</bold> way to collect messages"
t.rich('marketing__hero__subtitle', {
  bold: (chunks) => <strong>{chunks}</strong>,
})
```

## Common Violations

| Violation                      | Fix                                              |
| ------------------------------ | ------------------------------------------------ |
| `<Button>Save</Button>`        | `<Button>{t('common__save')}</Button>`           |
| `placeholder="Enter email"`    | `placeholder={t('auth__email_placeholder')}`     |
| `aria-label="Close dialog"`    | `aria-label={t('common__close')}`                |
| `alt="User avatar"`            | `alt={t('common__user_avatar_alt')}`             |
| `toast.success("Created!")`    | `toast.success(t('event__create__success'))`     |
| `title: "My Page"` in metadata | `title: t('seo__my_page__title')`                |
| `{isNew ? "New" : "Edit"}`     | `{isNew ? t('common__new') : t('common__edit')}` |

## Checklist Before Submitting

- [ ] No string literals in JSX content
- [ ] No hardcoded `placeholder`, `aria-label`, `alt`, or `title` attributes
- [ ] No hardcoded toast/notification messages
- [ ] No hardcoded validation error messages
- [ ] All new keys added to `messages/en.json`
- [ ] All new keys added to every other locale file
- [ ] Keys follow `scope__feature__element` flat convention
- [ ] Keys are snake_case throughout
- [ ] Using `useTranslations()` (client) or `getTranslations()` (server) with no namespace
