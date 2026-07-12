# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `yarn dev` — start dev server (HTTPS via mkcert at `https://dev.workout-tracker.com:5173`; add the host to `/etc/hosts`). `yarn dev:host` exposes it on the network.
- `yarn build` / `yarn preview` — production build and local preview.
- `yarn check` — type-check with `svelte-kit sync && svelte-check`. This is the main "does it compile" gate (there is no `tsc` build step of its own).
- `yarn lint` — ESLint over the repo (`eslint.config.js`, flat config; build artifacts are ignored there).
- `yarn test` — run the Vitest suite once. `yarn test:watch` for watch mode, `yarn coverage` for coverage.
- `yarn setup:dev` — `prisma generate && prisma db push`; run after cloning or changing `prisma/schema.prisma`.
- `docker compose up -d` — local PostgreSQL 16 (started with `wal_level=logical`, required by Zero). Its init scripts also create the auxiliary CVR + change-log databases zero-cache needs.

`check`, `lint`, and `test` are the automated verification gates. `prisma generate` also runs automatically on `postinstall`.

Note: a local **zero-cache** sync server (see `deploy/zero/`) must also be running for data to sync in dev; the SvelteKit app only hosts the thin `/api/zero/{token,query,mutate}` endpoints. See `deploy/zero/README.md`.

## Architecture

Local-first PWA: a SvelteKit **SPA** (SSR is disabled — `src/routes/+layout.ts` sets `ssr = false`) backed by **Rocicorp Zero** for offline-capable sync against a **Prisma/PostgreSQL** database, deployed to Vercel (`adapter-vercel`, with `vercel.json` rewriting all routes to `index.html`). (The app was migrated off Replicache; some comments still reference the old system.)

### Zero sync (the core pattern)

Each data mutation is defined **once** as a mutator function and runs in two places: optimistically on the client and authoritatively on the server (against Postgres), from the same code.

- **Mutators** — `src/lib/zero/mutators/**`, one file per operation, registered in `src/lib/zero/mutators/index.ts` via `defineMutators` (the `mutators` registry). Each is `m(async ({ tx, args, ctx }) => …)` operating on a Zero `Transaction`. `tx.location` is `"client"` (optimistic local write) or `"server"` (authoritative); `assertOwner(tx, ctx, userId)` in `mutators/shared.ts` only enforces ownership on the server. The client Zero instance is created in `src/lib/zero/z.svelte.ts` (`getZ` / `initZero`).
- Adding/changing a mutation: add the file under `mutators/<entity>/`, wire it into `mutators/index.ts`, and export its args type. Directories mirror the entities (`session`, `exercise`, `exerciseSet`, `exerciseType`, `settings`, `template`).
- **Writes go through the outbox facade**, not `z.mutate` directly: UI/actions call `zmutate.<entity>.<op>(args)` from `src/lib/zero/outbox.ts`, which runs the mutation when connected and otherwise buffers it in a persisted FIFO queue (`pendingWrites`) and replays on reconnect.
- **Queries** — `src/lib/zero/queries/**`, registered in `queries/index.ts`, all scoped to `ctx.userID`.

Sync endpoints (authenticated by a short-lived HS256 JWT, `sub = userId`, signed with `ZERO_AUTH_SECRET`; verified in `src/lib/zero/auth.server.ts`):
- `src/routes/api/zero/token/+server.ts` — mints the JWT from the Auth.js session.
- `src/routes/api/zero/query/+server.ts` — synced-query endpoint.
- `src/routes/api/zero/mutate/+server.ts` — re-runs the `mutators` against Postgres per authenticated user.

Conventions baked into the model:
- **Hard deletes with manual cascade**: rows are deleted for real. Zero's client store has no FK cascade, so delete mutators remove children first (e.g. `session/delete` deletes exercises → their sets → the session). Preserve this manual cascade when adding a delete mutator. (The old soft-delete `isDeleted` flag has been removed.)
- The Zero schema is generated from `prisma/schema.prisma` by `prisma-zero` into `src/lib/zero/generated/` on `prisma generate` — do not edit it by hand. Import it via `src/lib/zero/schema.ts` (`schema`, `zql`).

Reading data in components: `getZ().createQuery(queries.X())` and read `.data` inside a `$effect` — do not fetch the API directly.

### Auth

Auth.js for SvelteKit (`src/auth.ts`) with GitHub, Google, and Apple providers, using the Prisma adapter (database sessions). The `session` callback copies `user.id` onto `session.user`. On the `signIn` event it lazily backfills a user's `Settings` row if missing (kept there for backwards compatibility with existing DBs). Sign-in/error pages route to `/auth/login`. There is **no** credentials/dev provider — login always goes through real OAuth.

### App structure

- `src/routes/overview/**` — the main authenticated app (sessions, exercises, templates, settings). Route-local building blocks live under `components/`, `actions/`, `template/`.
- `src/routes/api/**` — `zero/{token,query,mutate}` (sync) and `user/[userId]/timer/push` (Pusher Beams "time is up" notification).
- `src/lib/components/ui/**` — shadcn-style primitives built on **bits-ui** + **tailwind-variants** (see `components.json`). `src/lib/base/**` and `src/lib/components/forms/**` are app-specific building blocks.
- Styling: **Tailwind** + **Skeleton** (`@skeletonlabs/skeleton`) with a custom theme (`src/theme.ts`, `src/theme.postcss`, `app.css`). PurgeCSS runs in the Vite build.
- PWA: `vite-plugin-pwa` with `injectManifest`; the service worker source is `src/service-worker.ts` (SvelteKit auto-registration is disabled — the PWA plugin owns it). `src/service-worker/beams-sw.js` is a vendored Pusher Beams bundle (excluded from lint).

### Testing

Vitest, configured as a workspace (`vitest.config.ts` + `vitest.workspace.ts`) with two projects: **`unit`** (node) for logic and the write-path, and **`components`** (jsdom, `@testing-library/svelte`) for components. Run with `yarn test`.

- **Helpers** live in `src/lib/testing/` (so they resolve via `$lib/testing/*` in both svelte-check and Vitest; they import no test framework and nothing in the app imports them): `fakeTx.ts` (`createFakeTx` — an in-memory Zero transaction that introspects the ZQL query AST; `runMutator` invokes an `m(...)` definition) and `fixtures.ts` (typed data builders).
- **Mutators** are tested against `createFakeTx` (no DB). When you add/change a mutator, add or update its co-located test. **Actions** are tested by mocking `$lib/zero/outbox` and asserting the `zmutate` calls. The **outbox** has its own tests.
- **Component tests** mock the Zero client singleton (`vi.mock("$lib/zero/z.svelte", …)` — the only injection seam) and feed fixtures via `createQuery(...).data`; do not mount `+layout.svelte` (it hard-imports PWA/Beams/Vercel/Skeleton). `$app`/`$env` are stubbed via aliases in `tests/mocks/`; `tests/setup.components.ts` seeds `localStorage` and polyfills `element.animate`/`matchMedia`.
- Convention: co-locate unit tests as `*.test.ts`; component tests go in `tests/components/**` (or `*.svelte.test.ts`) and run in jsdom.

### Conventions

- Import aliases: **`$lib`** → `src/lib` (SvelteKit default, the one used throughout and understood by svelte-check). A **`$`** → `src` Vite alias also exists (`vite.config.js`) but is not in the tsconfig paths, so prefer `$lib` for anything type-checked.
- Server-only Prisma singleton: `src/lib/db.server.ts` (default export, commonly imported as `prismaClient`). Some entry points still `new PrismaClient()` directly.
- Prisma-derived helper types live in `src/lib/utils/prismaTypes` (e.g. `ExerciseFull`, `WorkoutSessionTemplateWithExerciseTypes`).
- Env vars: the public ones actually read in `src` are `PUBLIC_ZERO_SERVER` and `PUBLIC_BEAMS_INSTANCE_ID` (`$env/static/public` / `$env/dynamic/public`). Server-side: `ZERO_AUTH_SECRET` (must match zero-cache), `AUTH_SECRET`, the OAuth provider id/secret pairs, `BEAMS_SECRET_KEY`, and the Postgres connection vars. See `deploy/zero/README.md` for the sync-server side.
