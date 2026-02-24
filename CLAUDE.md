# Monorepo

Turborepo monorepo with Bun. Two apps (`web`, `api`) and three shared packages.

## Commands

```bash
# Root (runs across all workspaces via Turborepo)
bun run dev              # Start all apps (web :3000, api :8000) + local Supabase
bun run build            # Build all apps & packages
bun run lint             # Lint all workspaces (runs typecheck + format first)
bun run format           # Prettier across the repo

# Per-app (run from app directory, or use --filter)
bun run typecheck        # tsc --noEmit
bun run test             # Tests (API only for now)

# Database (runs in apps/api via Turborepo)
bun run db:start         # Start local Supabase (Postgres :54322, API :54321)
bun run db:stop          # Stop local Supabase
bun run db:reset         # Drop & recreate local DB, reapply all migrations
```

**After any code changes, run `bun run lint` from the workspace root and fix all errors before considering the task complete.**

## Architecture

```
repo/
├── apps/
│   ├── api/             # Elysia REST API (Bun, port 8000)
│   └── web/             # Next.js 16 frontend (port 3000)
├── packages/
│   ├── shared/          # @repo/shared — Zod schemas & types shared across apps
│   ├── eslint-config/   # @repo/eslint-config — flat configs (node, next-js)
│   └── ts-config/       # @repo/ts-config — base, nextjs configs
├── turbo.json           # Task pipeline & globalEnv declarations
└── package.json         # Workspaces, root scripts, packageManager: bun@1.3.9
```

## Shared package (`@repo/shared`)

Zod schemas and TypeScript types consumed by both apps. Source lives in `packages/shared/src/`.

### API schemas

`packages/shared/src/api/index.ts` re-exports all API-related schemas and types:

- **`CoercedNullableDate`** — Zod codec that coerces `string | Date | null` to `Date | null` (in `_core.ts`)
- **Signup schemas** (`user.ts`): `SignUpRequestBase`, `SignUpRequest` (extends base with `password`), `SignUpRequestAdmin` (extends base with `userId`), `EmailVerificationState`

Note: The `User` type lives in the API app (`apps/api/src/users/types.ts`), not the shared package.

### Error classes

`packages/shared/src/api/errors.ts` exports an error hierarchy extending `EdenFetchError` from `@elysiajs/eden`:

- **`ApiError`** — base class with `static fromResponse(response)` factory
- **`BadRequestError`** (400), **`UnauthorizedError`** (401), **`NotFoundError`** (404), **`InternalServerError`** (500), **`BadGatewayError`** (502)

These are used across both apps for typed error handling with the Eden Treaty client.

### Adding new shared types

1. Create or edit a file in `packages/shared/src/`
2. Export it from the appropriate barrel (`src/api/index.ts` or `src/index.ts`)
3. Run `bun run build` in `packages/shared` (or let Turborepo handle it via dependency graph)
4. Import from `@repo/shared` in either app

### Utility types

`packages/shared/src/utils.ts` contains generic TypeScript utility types (`RemoveNullOn`, `DiscriminatedUnion`, `ResponseWith`, etc.).

## API app (`apps/api`)

Elysia + Drizzle ORM + Supabase (Postgres). Routes are organized by feature domain (`src/users/`, `src/admin/`) with database schemas, services, and types co-located.

### Admin module

`src/admin/` provides routes for user creation, OAuth sync, and email verification management. Protected by a separate `ADMIN_BEARER_TOKEN` middleware (`src/admin/middleware.ts`) rather than Supabase user auth.

### Key API-specific commands (run from `apps/api/`):

```bash
bun run db:generate --name=<name>   # Generate migration SQL into supabase/migrations/
bun run db:migrate                  # Apply pending migrations
bun run db:push                     # Drizzle push (quick iteration only)
bun run db:studio                   # Drizzle Studio GUI
bunx supabase db reset              # Full DB reset
```

## Web app (`apps/web`)

Next.js 16 with App Router, React 19, Tailwind CSS 4, React Compiler enabled.

### Key conventions

- **Path aliases:** `@/*` maps to `./src/*`, `@env` maps to `./src/lib/env.ts`
- **Supabase Auth via `@supabase/ssr`:** browser client (`getSupabaseBrowser()` — singleton) and server client (`getSupabaseServer()` — async, uses Next.js cookies)
- **API calls:** Eden Treaty typed RPC client (`api`) from `src/lib/api/_core/client.ts` — automatically injects Bearer token from Supabase session and PostHog session ID. Admin operations use a separate `adminApi` client (`src/lib/api/_core/adminClient.ts`) authenticated with `ADMIN_BEARER_TOKEN`. Server-side Next.js API routes use `nextFetcher()` from `src/lib/api/_core/nextFetcher.ts` for plain fetch with Zod parsing.
- **User data:** `useUser()` hook (`src/lib/hooks/useUser.tsx`) — fetches current user, polls every 60s, listens to auth state changes, integrates PostHog
- **API endpoint wrappers** live in `src/lib/api/` (e.g. `user.ts` exports `getCurrentUser()`)
- **Middleware proxy:** `src/proxy.ts` runs Supabase session refresh on every matched request via Next.js middleware

### Key dependencies

- `@elysiajs/eden` for typed API client (Eden Treaty)
- `@supabase/ssr` + `@supabase/supabase-js` for auth
- `framer-motion` for animations
- `posthog-js` for analytics
- `@heroicons/react` for icons
- `tailwind-merge` + `clsx` for class utilities

## Auth flow (end-to-end)

1. **Web:** User authenticates via Supabase Auth (`@supabase/ssr`). Session is stored in cookies (cookie name: `session`).
2. **Web → API:** The Eden Treaty client (`src/lib/api/_core/client.ts`) reads the Supabase access token via `getAccessToken()` and sends it as `Authorization: Bearer <token>`.
3. **API middleware** (`apps/api/src/core/middleware/auth.ts`): Elysia `derive({ as: 'scoped' })` plugin extracts the Bearer token and calls `supabase.auth.getUser(token)`. Returns 401 on failure, injects `user` and `posthog` into the Elysia context on success.
4. **API route** accesses `user` from context (e.g. to query the app's `users` table by `user.id`).

## Code standards

- **Strict TypeScript** — no `any`, no `require()`, no CommonJS. ES modules only (`import`/`export`).
- **TypeScript 5.9.2** across the entire monorepo.
- **ESLint flat config** — API uses `@repo/eslint-config/node` (enforces `explicit-function-return-type`), web uses `@repo/eslint-config/next-js`.
- **Prettier** — tabs, single quotes, semicolons, 120 print width, trailing commas. Import sorting via `@trivago/prettier-plugin-sort-imports`.
- **Environment variables:** App-specific env vars go in the app's local `turbo.json` (e.g. `apps/api/turbo.json`) under `tasks.dev.env`. Only truly global vars shared across all apps belong in the root `turbo.json` `globalEnv` array. Both satisfy the `turbo/no-undeclared-env-vars` lint rule.

## Environment

- **Bun** 1.3.9 (package manager + API runtime)
- **Node** 24 (web runtime)
- **Local Supabase:** API on `:54321`, Postgres on `:54322`
- **Web:** `http://localhost:3000`
- **API:** `http://localhost:8000`
