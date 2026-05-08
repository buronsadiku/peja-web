# Skills Index

Reusable patterns for the Peja Web project — Next.js 16, Tailwind CSS v4, next-intl v4, React 19.

## Quick Reference

| Skill | When to Use |
|-------|-------------|
| [project-setup](project-bootstrap/project-setup.md) | Project structure, file organization, path aliases |
| [env-management](project-bootstrap/env-management.md) | Environment variables, typed access, server/client split |
| [tailwind-design-system](ui/tailwind-design-system.md) | CSS v4 @theme config, tokens, cn(), cva components |
| [component-conventions](ui/component-conventions.md) | File structure, naming, server/client split, props |
| [next-intl-setup](i18n/next-intl-setup.md) | Routing, translations, currency, navigation wrappers |
| [no-hardcoded-text](i18n/no-hardcoded-text.md) | Enforce all user-facing strings use translation keys |
| [route-structure](app-router/route-structure.md) | Route groups, dynamic segments, async params |
| [layouts-and-providers](app-router/layouts-and-providers.md) | Server/client layout split, providers, auth guards |
| [metadata](app-router/metadata.md) | SEO, Open Graph, language alternates |
| [proxy-auth](auth/proxy-auth.md) | proxy.ts, route protection, JWT, dual auth strategy |
| [data-layer](data-layer/data-layer.md) | API client, fetching, caching, server/client data flow |
| [zustand-patterns](state/zustand-patterns.md) | Global/feature stores, persistence, server sync |
| [react-hook-form-patterns](forms/react-hook-form-patterns.md) | RHF + Zod, i18n schemas, Zustand sync |
| [sentry-setup](observability/sentry-setup.md) | Error tracking, source maps, error boundaries |
| [typescript-patterns](typescript/typescript-patterns.md) | Type naming, prop patterns, schema inference, generics, utility types |

## Next.js 16 Breaking Changes (always remember)

- `proxy.ts` replaces `middleware.ts` — runs on Node.js, not Edge
- `params` is `Promise<T>` — must `await` in server components, `use()` in client
- `cookies()` and `headers()` are async — must `await`
- `fetch()` not cached by default — must opt in with `cache: 'force-cache'`
- Turbopack is the default bundler
- `next lint` removed — use ESLint CLI directly
- Tailwind v4 uses CSS `@theme inline`, no `tailwind.config.ts`

## Dependency Map

```
project-setup ─── env-management
                └── tailwind-design-system ─── component-conventions

route-structure ─── layouts-and-providers ─── proxy-auth
                                            └── next-intl-setup

data-layer ─── proxy-auth (auth tokens)

zustand-patterns ─── react-hook-form-patterns (store sync)
                 └── layouts-and-providers (server→client sync)

sentry-setup ─── layouts-and-providers (error boundary)
```
