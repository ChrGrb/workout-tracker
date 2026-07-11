import { Z } from "zero-svelte";
import type { AnyMutatorRegistry } from "@rocicorp/zero";
import { get } from "svelte/store";
import { env } from "$env/dynamic/public";
import { schema, type Schema } from "./schema";
import { mutators } from "./mutators";
import { useUserId } from "$lib/stores/stores";

// The single Zero client for the signed-in session. Built after auth is known
// (see initZero, called from the root layout once the user id is available).
let current = $state<Z<Schema> | undefined>(undefined);

// Fetches a fresh short-lived Zero JWT from our own endpoint (which reads the
// Auth.js session). Returns undefined if the user is not authenticated.
async function fetchToken(): Promise<string | undefined> {
  try {
    const res = await fetch("/api/zero/token");
    if (!res.ok) return undefined;
    const body = (await res.json()) as { token?: string };
    return body.token;
  } catch {
    return undefined;
  }
}

// Fetch a token and (re)apply it to the connection.
async function authenticate(z: Z<Schema>) {
  const token = await fetchToken();
  if (token) await z.connection.connect({ auth: token });
}

// Re-mint and re-apply the token whenever the connection reports it needs auth
// or errors (a 401 from the query/mutate endpoints surfaces here). Guarded so a
// persistently-rejected token can't spin a tight reconnect loop.
let lastAuthAt = 0;
function watchAuth(z: Z<Schema>) {
  z.connection.state.subscribe((state) => {
    if (state.name === "needs-auth" || state.name === "error") {
      const now = Date.now();
      if (now - lastAuthAt < 5000) return;
      lastAuthAt = now;
      void authenticate(z);
    }
  });
}

// Build the client synchronously so getZ() has an instance immediately, then
// authenticate in the background. `context` supplies `ctx.userID` for the
// client-side evaluation of the user-scoped synced queries.
function build(userID: string): Z<Schema> {
  const z = new Z<Schema>({
    cacheURL: env.PUBLIC_ZERO_SERVER ?? "",
    schema,
    userID,
    context: { userID },
    // Runtime accepts the mutator registry; the Z generic is typed narrower.
    mutators: mutators as unknown as AnyMutatorRegistry,
    kvStore: "idb",
  });
  watchAuth(z);
  void authenticate(z);
  current = z;
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
