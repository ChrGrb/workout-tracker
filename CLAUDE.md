# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `yarn dev` — start dev server (HTTPS via mkcert at `https://dev.workout-tracker.com:5173`; add the host to `/etc/hosts`). `yarn dev:host` exposes it on the network.
- `yarn build` / `yarn preview` — production build and local preview.
- `yarn check` — type-check with `svelte-kit sync && svelte-check`. This is the main "does it compile" gate (there is no `tsc` build step of its own).
- `yarn lint` — ESLint over the repo (`eslint.config.js`, flat config).
- `yarn setup:dev` — `prisma generate && prisma db push`; run after cloning or changing `prisma/schema.prisma`.
- `docker compose up --build -d` — local PostgreSQL + Redis (required for the app to run locally).

There is no test runner configured — `check` and `lint` are the only automated verification. `prisma generate` also runs automatically on `postinstall`.

## Architecture

Local-first PWA: a SvelteKit **SPA** (SSR is disabled — `src/routes/+layout.ts` sets `ssr = false`) backed by **Replicache** for offline-capable sync against a **Prisma/PostgreSQL** database, deployed to Vercel (`adapter-vercel`, with `vercel.json` rewriting all routes to `index.html`).

### Replicache sync (the core pattern)

Every data mutation is defined **twice** and both copies must be kept in lockstep:

- **Client mutators** — `src/lib/utils/replicache/mutations/**`. Operate on a Replicache `WriteTransaction` (optimistic local writes). Registered in `src/lib/utils/replicache/mutations/mutations.ts` (the `mutators` map / `M` type). The client Replicache instance is created in `src/lib/stores/stores.ts` (`getReplicache`).
- **Server mutators** — `src/lib/utils/api/replicache/mutations/**`. Apply the same change to Postgres via Prisma. Dispatched from the push endpoint.

When adding or changing a mutation, update **both** trees and the `mutators` map. The directory layouts mirror each other by entity (`session`, `exercise`, `exerciseSet`, `exerciseType`, `user/settings`, `user/workoutSessionTemplate`).

Sync endpoints:
- `src/routes/api/replicache/push/+server.ts` — applies mutations inside a **Serializable** Prisma transaction, bumps the space version, then pokes clients.
- `src/routes/api/replicache/pull/+server.ts` — returns `lastMutationIDChanges`, the new cookie (space version), and the patch of changed entries.

Both endpoints authenticate via `?userId=` query param. Serializable isolation and generous transaction timeouts are **required** for Replicache correctness — do not lower them.

Sync conventions baked into the schema:
- **Versioning**: `ReplicacheSpace.versionAt` is the per-user cookie; rows carry `versionUpdatedAt` so pulls can compute deltas.
- **Soft deletes**: rows are never hard-deleted; they get `isDeleted = true` and are stripped client-side by `filterDeleted` (see `subscribeReplicacheData.ts`). Preserve this — deletes are mutations that flip the flag.
- Pokes (invalidate → client pulls) and push notifications go through **Pusher** / Pusher Beams; poke sender is `src/lib/utils/api/replicache/poke/send.ts`.

Reading data in components: subscribe via `subscribeReplicacheData` / `subscribeReplicacheDataSingle` (prefix scans over the local Replicache store), not by fetching the API directly.

### Auth

Auth.js for SvelteKit (`src/auth.ts`) with GitHub, Google, and Apple providers, using the Prisma adapter. On `signIn` it lazily backfills a user's `Settings` and `ReplicacheSpace` rows (kept in the event handler for backwards compatibility with existing DBs). Sign-in/error pages route to `/auth/login`.

### App structure

- `src/routes/overview/**` — the main authenticated app (sessions, exercises, templates, settings). Route-local components live under `components/`, `actions/`, `template/`.
- `src/routes/api/**` — REST endpoints (replicache pull/push, plus `exercise`, `session`, `user` resources).
- `src/lib/components/ui/**` — shadcn-style primitives built on **bits-ui** + **tailwind-variants** (see `components.json`). `src/lib/base/**` and `src/lib/components/forms/**` are app-specific building blocks.
- Styling: **Tailwind** + **Skeleton** (`@skeletonlabs/skeleton`) with a custom theme (`src/theme.ts`, `src/theme.postcss`, `app.css`). PurgeCSS runs in the Vite build.
- PWA: `vite-plugin-pwa` with `injectManifest`; the service worker source is `src/service-worker.ts` (SvelteKit auto-registration is disabled — the PWA plugin owns it).

### Conventions

- Import alias: **`$`** maps to `src/` (configured in `vite.config.js`), e.g. `import x from "$lib/..."`. Note this is `$`, not the SvelteKit-default `$lib` only.
- Server-only Prisma singleton: `src/lib/db.server.ts` (`prismaClient`). Some entry points still `new PrismaClient()` directly.
- Prisma-derived helper types live in `src/lib/utils/prismaTypes` (e.g. `ExerciseFull`, `WorkoutSessionTemplateWithExerciseTypes`).
- Optional `OPENAI_API_KEY` powers auto-generated exercise descriptions; the app runs without it.
- Env vars: see `.env.temp`. `PUBLIC_*` vars (Replicache license key, Pusher key/cluster, Beams instance) are read via `$env/static/public`.
