# Bun Turborepo Template

A production-ready monorepo template with **Bun**, **Turborepo**, **Supabase Auth**, and full-stack TypeScript.

## What's included

- **API** — Elysia REST API with Drizzle ORM and Supabase Postgres (`apps/api`)
- **Web** — Next.js 16 with App Router, React 19, Tailwind CSS 4 (`apps/web`)
- **Shared** — Zod schemas and TypeScript types consumed by both apps (`packages/shared`)
- **Auth** — End-to-end authentication via Supabase Auth (email/password + Google OAuth)
- **Analytics** — PostHog integration
- **Tooling** — ESLint flat config, Prettier, TypeScript 5.9, Docker Compose

## Getting started

```bash
# Install dependencies
bun install

# Start local Supabase + all apps
bun run dev
```

- **Web:** http://localhost:3000
- **API:** http://localhost:8000
- **Supabase API:** http://localhost:54321
- **Postgres:** http://localhost:54322

## Commands

```bash
bun run dev          # Start all apps + local Supabase
bun run build        # Build all apps & packages
bun run lint         # Lint all workspaces
bun run format       # Prettier across the repo
```

## Architecture

```
repo/
├── apps/
│   ├── api/             # Elysia REST API (Bun, port 8000)
│   └── web/             # Next.js 16 frontend (port 3000)
├── packages/
│   ├── shared/          # @repo/shared — Zod schemas & types
│   ├── eslint-config/   # @repo/eslint-config — flat configs
│   └── ts-config/       # @repo/ts-config — base, nextjs, prettier configs
├── turbo.json
└── package.json
```

## Auth flow

1. User authenticates via Supabase Auth on the web app
2. `fetcher()` sends the access token as `Authorization: Bearer <token>` to the API
3. API middleware validates the token via `supabase.auth.getUser(token)`
4. Authenticated user is injected into the Elysia route context

## Environment

- **Bun** 1.3.9 (package manager + API runtime)
- **Node** 24 (web runtime)
- **TypeScript** 5.9.2
