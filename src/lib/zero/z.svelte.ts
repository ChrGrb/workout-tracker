import { Z } from "zero-svelte";
import type { AnyMutatorRegistry } from "@rocicorp/zero";
import { env } from "$env/dynamic/public";
import { schema, type Schema } from "./schema";
import { mutators } from "./mutators";

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

// Re-mint and re-apply the token whenever zero-cache reports it needs auth
// (token expiry, or first connect before a token was available).
function watchAuth(z: Z<Schema>) {
  z.connection.state.subscribe(async (state) => {
    if (state.name === "needs-auth") {
      const token = await fetchToken();
      if (token) await z.connection.connect({ auth: token });
    }
  });
}

export async function initZero(userID: string): Promise<Z<Schema>> {
  if (current) return current;
  const token = await fetchToken();
  const z = new Z<Schema>({
    cacheURL: env.PUBLIC_ZERO_SERVER ?? "",
    schema,
    userID,
    auth: token ?? undefined,
    // Runtime accepts the mutator registry; the Z generic is typed narrower.
    mutators: mutators as unknown as AnyMutatorRegistry,
    kvStore: "idb",
  });
  watchAuth(z);
  current = z;
  return z;
}

export function getZ(): Z<Schema> {
  if (!current) {
    throw new Error("Zero is not initialised yet — call initZero(userID) first");
  }
  return current;
}

export function getZOrUndefined(): Z<Schema> | undefined {
  return current;
}

export function closeZero() {
  current?.close();
  current = undefined;
}
