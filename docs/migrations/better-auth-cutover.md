# Better Auth migration plan

## Architecture

```
[browser] ──cookie──> [Next.js / Better Auth] ──short-lived JWT──> [NestJS]
                            │
                            └─ Postgres (users, session, account, verification, jwks)
```

- Better Auth owns sessions and credentials in Next.js
- Frontend obtains a 10-minute JWT from `/api/auth/token` and sends it as
  `Authorization: Bearer <jwt>` to the API via the proxy
- NestJS verifies the JWT against the JWKS at `/api/auth/jwks` — stateless,
  no DB hit per request

## Phase 1 — done

- `better-auth`, `pg`, `resend` installed in `peja-web`
- `lib/auth/better-auth.ts` — config with email/password (verification +
  reset email callbacks), Google + Apple OAuth, account linking with Google
  as a trusted provider, JWT plugin issuing 10-minute tokens, rate limiting
  20/min, runtime assertion that `BETTER_AUTH_SECRET` is set in production
- `lib/auth/email-sender.ts` — Resend wrapper with locale-aware verify and
  reset templates (en/fr/nl/de/es/it)
- `app/api/auth/[...all]/route.ts` — Better Auth handler
- `lib/auth/client.ts`, `lib/auth/server-session.ts` — React + server helpers
- Drizzle schema in `peja-api`:
  - `users` extended with `email_verified`; `auth_provider_id` made nullable
  - new tables: `session`, `account`, `verification`, `jwks` (in
    `database/schema/auth.ts`)
- `BetterAuthJwtService` in `peja-api` — JWKS-backed JWT verifier; no
  direct DB session lookup

The existing Supabase auth path is untouched. Both systems coexist.

## Step 1 — generate migration

The Drizzle schema in NestJS is the source of truth. From `peja-api`:

```bash
pnpm db:generate
pnpm db:migrate
```

This adds `email_verified` and the four Better Auth tables. Verify in
`psql`:

```sql
\d users        -- email_verified column present
\dt session     -- exists
\dt account     -- exists
\dt verification
\dt jwks
```

## Step 2 — env vars

Add to `peja-web/.env.local` and Railway env:

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=<openssl rand -base64 32>
TRUSTED_ORIGINS=https://app.peja.app,https://peja.app
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
APPLE_CLIENT_ID=...
APPLE_CLIENT_SECRET=...
RESEND_API_KEY=re_...
EMAIL_FROM=Peja <hello@peja.app>
```

In `peja-api`, no new env vars — `FRONTEND_BASE_URL` is already used by
the JWT service to fetch JWKS.

## Step 3 — verify the email flow

```bash
curl -X POST $APP_URL/api/auth/sign-up/email \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"correct-horse-battery-staple"}'
```

You should see a Resend log entry with the verification email. Click the
link, confirm the user row's `email_verified` flips to `true`, then call
`/api/auth/sign-in/email` with the same credentials.

## Step 4 — switch the proxy

`src/app/api/proxy/[...path]/route.ts` currently reads `auth_token` cookie
(Supabase JWT) and forwards as Bearer. Replace with:

```ts
const session = await auth.api.getSession({ headers: incoming });
if (!session) return new Response("Unauthorized", { status: 401 });
const { token } = await auth.api.getToken({ headers: incoming });
out["authorization"] = `Bearer ${token}`;
```

Now every API request validates the cookie via Better Auth and forwards a
fresh 10-minute JWT.

## Step 5 — switch the NestJS guard

In `src/common/guards/auth.guard.ts`, swap:

```ts
const decoded = await this.verifyToken(token, env);  // old: Supabase JWKS
const authProviderId = decoded[env.AUTH_USER_ID_CLAIM];
const user = await usersRepo.findByAuthProviderId(authProviderId);
```

For:

```ts
const user = await this.betterAuthJwt.verify(token);
```

Inject `BetterAuthJwtService` into the guard. Drop the `jwks-rsa`
constructor fields that point at Supabase. The existing `jwks-rsa` and
`jsonwebtoken` deps stay (now used by the new verifier).

Add `BetterAuthJwtService` to `AuthModule.providers` and export it.

## Step 6 — switch the frontend forms

Replace each form's submit handler to use Better Auth's client:

| File | Old | New |
|---|---|---|
| `SignInFormStep.tsx` | `authClient.signIn(...)` from `@/lib/api/auth-client` | `signIn.email(...)` from `@/lib/auth/client` |
| `CreateAccountStep.tsx` | `authClient.signUp(...)` | `signUp.email(...)` |
| `VerifyEmailStep.tsx` | `authClient.verifyEmail(...)` | Better Auth handles the URL automatically |
| `ForgotPasswordPage.tsx` | `authClient.resetPasswordEmail(...)` | `authClient.forgetPassword(...)` |
| `ResetPasswordPage.tsx` | `authClient.resetPassword(...)` | `authClient.resetPassword(...)` (BA client) |
| `OauthCallbackPage.tsx` | manual code exchange | Better Auth handles `/api/auth/callback/<provider>` automatically; this page can be deleted |

After each form is migrated, delete the corresponding
`src/app/api/auth/{signin,signout,refresh,oauth,verify-email}/route.ts`.

## Step 7 — remove Supabase

Once all forms and the proxy are switched and you've verified end-to-end:

```bash
cd peja-api && pnpm remove @supabase/supabase-js
```

Delete:
- `peja-api/src/modules/auth/supabase-auth.provider.ts`
- Most of `peja-api/src/modules/auth/auth.controller.ts` (Better Auth
  replaces these routes)
- `peja-web/src/app/api/auth/{signin,signout,refresh,oauth,verify-email}/route.ts`
- `SUPABASE_*` and `AUTH_*` env vars from both `.env.example` files

Keep `BetterAuthJwtService` and the new `auth.ts` schema.

## Rollback

Phases 1, 2, 3 introduce no behavioural change — `git revert` is safe.
After Step 4 the cookie format changes; rollback requires forcing all
sessions to expire (drop rows from `session` table or change
`cookiePrefix`). Plan to roll forward only past Step 4.

## Design choices that pay off here

- **No two `users` tables** — Better Auth maps onto the existing one
- **No DB hit per API call** — JWT verification is in-memory after JWKS
  warm-up
- **No shared secret between Next.js and NestJS** — JWT plugin uses
  asymmetric keys stored in `jwks` table; private key never leaves
  Next.js
- **No raw session-token comparison** — every JWT carries a signature
  Next.js minted; tampering invalidates it
