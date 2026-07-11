# Deploying zero-cache (Replicache → Zero migration)

zero-cache is the sync server. It **cannot** run on Vercel (it needs a persistent
disk for its SQLite replica, long-lived WebSockets, and a direct Postgres
connection). It runs here on Coolify. The Vercel app only hosts the thin
`/api/zero/{token,query,mutate}` HTTP endpoints.

```
 Browser (zero-svelte)  ──wss──►  zero-cache (Coolify)  ──logical replication──►  Neon
        │                              │
        │  GET /api/zero/token         │  POST /api/zero/query   (synced queries)
        └──────────────►  Vercel app  ◄┘  POST /api/zero/mutate  (custom mutators)
```

## One-time setup

### 1. Neon: enable logical replication
Neon console → your project → **Settings → Logical Replication → Enable**. This
restarts the compute once. (Zero requires Postgres ≥ 15 with `wal_level=logical`;
Neon satisfies this once the toggle is on.)

### 2. Neon: create the replication publication
Run `sql/zero-publication.sql` against the Neon database (via `psql` on the
`POSTGRES_URL_NON_POOLING` connection, or the Neon SQL editor). It creates a
publication named `zero_data` that lists **only** the application tables — the
Auth.js secret tables (`Account`, `Session`, `VerificationToken`) are deliberately
excluded so OAuth/session tokens never replicate to clients.

> Run this **after** the Phase 1b/1c schema migrations have been applied to Neon,
> so the published table set matches the final schema. Re-running DDL on published
> tables can force a zero-cache replica reset (it self-heals but re-syncs clients).

### 3. Schema & permissions — nothing to build or deploy
With synced queries + custom mutators (this app's model) there is **no** schema
artifact to build and **no** permissions to deploy:
- zero-cache learns the tables/columns by introspecting the tables in the
  `zero_data` publication (`ZERO_APP_PUBLICATION`).
- Read/write authorization lives in the app's `/api/zero/query` and
  `/api/zero/mutate` endpoints (queries scoped by `ctx.userID`, mutators guarded by
  `assertOwner`).

Do **not** run `zero-build-schema` (deprecated/removed) or `zero-deploy-permissions`
(that is the deprecated RLS-permissions model, which we don't use). If a future
zero-cache build refuses to start without a permissions record, deploy an empty one
with `npx zero-deploy-permissions -p src/lib/zero/schema.ts` (our `schema.ts`
exports no `permissions`, so this deploys an empty set).

> Note on `ZERO_AUTH_SECRET`: it IS required on zero-cache (despite the deprecation
> warning Zero prints). The cache verifies the client's JWT with it to authenticate
> the WebSocket. Without it, authenticated sockets are dropped with "WebSocket
> connection closed abruptly". It must equal the app's `ZERO_AUTH_SECRET`.

### 4. Coolify: deploy
- New resource → **Docker Compose** → point at `deploy/zero/docker-compose.yml`.
- Set the environment variables from `.env.example` (Coolify env UI).
- Expose the `zero-cache` service on a subdomain, e.g. `zero.<your-domain>`, with
  TLS. Coolify's Traefik proxy upgrades WebSockets automatically; if long-lived
  connections drop, raise the proxy idle/read timeout.
- `ZERO_AUTH_SECRET` **must equal** the app's `ZERO_AUTH_SECRET` (the token signer).

### 5. Vercel: app environment
Add to the Vercel project:
- `ZERO_AUTH_SECRET` — same value as zero-cache.
- `PUBLIC_ZERO_SERVER` — `https://zero.<your-domain>` (read by the browser client).
  Use the `https://` scheme, NOT `wss://` — Zero upgrades to a WebSocket itself.
- `POSTGRES_URL_NON_POOLING` — already present; the mutate endpoint writes through it.

## Verify
1. `curl https://zero.<domain>/` (or check Coolify logs) — zero-cache reports
   "replica ready" after initial sync.
2. In the app, sign in and open devtools → Network → WS: a `wss://zero.<domain>`
   connection should be **connected**.
3. Create a session on one device; it appears on a second device within ~1s (this
   replaces the old Pusher poke round-trip).

## Operational notes
- **Backups**: single-node keeps the replica on the `zero-replica` volume; it can
  always be rebuilt from Neon, so back up Neon, not the replica.
- **Upgrades**: bump the `rocicorp/zero` image tag in lockstep with the
  `@rocicorp/zero` version in the app's `package.json`.
- **Replication slot**: if zero-cache is offline for a long time Neon may drop the
  inactive slot; on restart zero-cache re-syncs from scratch (self-healing).
