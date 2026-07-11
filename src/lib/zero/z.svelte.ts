import { Z } from "zero-svelte";
import type { AnyMutatorRegistry } from "@rocicorp/zero";
import { get } from "svelte/store";
import { env } from "$env/dynamic/public";
import { schema, type Schema } from "./schema";
import { mutators } from "./mutators";
import { useUserId } from "$lib/stores/stores";

// The single Zero client for the signed-in session.
let current = $state<Z<Schema> | undefined>(undefined);

const TOKEN_KEY = "zeroToken";

function cachedToken(): string | undefined {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

// Fetches a fresh Zero JWT from our endpoint (which reads the Auth.js session) and
// caches it so the next construction can pass it synchronously as `auth`.
async function fetchToken(): Promise<string | undefined> {
  try {
    const res = await fetch("/api/zero/token");
    if (!res.ok) return undefined;
    const body = (await res.json()) as { token?: string };
    if (body.token) {
      try {
        localStorage.setItem(TOKEN_KEY, body.token);
      } catch {
        /* ignore storage failures */
      }
    }
    return body.token;
  } catch {
    return undefined;
  }
}

// Fetch a fresh token and apply it to the connection. Per the Zero auth docs, the
// refresh mechanism is connection.connect({auth}); it updates the auth used for the
// connection (and reconnects).
async function reauth(z: Z<Schema>) {
  const token = await fetchToken();
  if (token) await z.connection.connect({ auth: token });
}

// Re-mint and re-apply the token whenever the connection needs auth or errors
// (a 401/403 from the query/mutate endpoints surfaces as needs-auth). Guarded
// against a tight loop when a token is persistently rejected.
let lastAuthAt = 0;
function watchAuth(z: Z<Schema>) {
  z.connection.state.subscribe((state) => {
    if (state.name === "needs-auth" || state.name === "error") {
      const now = Date.now();
      if (now - lastAuthAt < 5000) return;
      lastAuthAt = now;
      void reauth(z);
    }
  });
}

function build(userID: string): Z<Schema> {
  // Construct WITH the token as the `auth` option (the documented usage), using any
  // cached token so the first connection is authenticated. Passing it here — rather
  // than only via connect() afterward — is what keeps reconnects authenticated.
  const z = new Z<Schema>({
    cacheURL: env.PUBLIC_ZERO_SERVER ?? "",
    schema,
    userID,
    auth: cachedToken(),
    // `context` supplies `ctx.userID` for client-side evaluation of the
    // user-scoped synced queries.
    context: { userID },
    // Runtime accepts the mutator registry; the Z generic is typed narrower.
    mutators: mutators as unknown as AnyMutatorRegistry,
    kvStore: "idb",
  });
  watchAuth(z);
  current = z;
  // Refresh to a current token from the server (also covers first login, where no
  // token was cached yet).
  void reauth(z);
  return z;
}

// Explicit init (from the layout). Idempotent.
export function initZero(userID: string): Z<Schema> {
  return current ?? build(userID);
}

// Lazy accessor for components: builds the client on first use from the persisted
// user id, so it works regardless of layout/component mount ordering.
export function getZ(): Z<Schema> {
  if (current) return current;
  const userID = get(useUserId());
  if (!userID) {
    throw new Error("Zero: no signed-in user id available yet");
  }
  return build(userID);
}

export function getZOrUndefined(): Z<Schema> | undefined {
  return current;
}

export function closeZero() {
  current?.close();
  current = undefined;
}
