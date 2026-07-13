import { persisted } from "svelte-persisted-store";
import { get } from "svelte/store";
import { nanoid } from "nanoid";
import { getZOrUndefined } from "./z.svelte";
import { mutators } from "./mutators";
import type { Z } from "zero-svelte";
import type { Schema } from "./schema";
import type {
  CreateSessionArgs,
  UpdateSessionArgs,
  CreateExerciseArgs,
  CreateExerciseSetArgs,
  UpdateSettingsArgs,
  CreateExerciseTypeArgs,
  UpdateExerciseTypeArgs,
  CreateTemplateArgs,
  UpdateTemplateArgs,
  CreateEquipmentArgs,
  UpdateEquipmentArgs,
} from "./mutators";

// ---------------------------------------------------------------------------
// Offline write outbox.
//
// Zero applies mutations optimistically and pushes them while ONLINE, but it
// rejects writes while disconnected. This queue buffers mutations made offline
// and replays them (in order) once the connection returns — important for a gym
// PWA used on flaky connectivity.
//
// Honest limitation: a queued (not-yet-replayed) write is NOT reflected in the
// local Zero store, so the UI won't show it until reconnect. The OutboxIndicator
// surfaces the pending count so the user knows the write is saved-but-not-synced.
// ---------------------------------------------------------------------------

type OutboxEntry = {
  id: string;
  name: string;
  args: unknown;
  enqueuedAt: number;
  attempts: number;
};

const MAX_ATTEMPTS = 10;

export const pendingWrites = persisted<OutboxEntry[]>("zero-outbox", []);

function runMutation(z: Z<Schema>, name: string, args: unknown): Promise<unknown> {
  const [ns, fn] = name.split(".");
  // `mutators` is a defineMutators registry: calling registry[ns][fn](args) builds
  // a MutateRequest, which is then executed by the client via z.mutate(request).
  // (This is NOT the same as z.mutate[ns][fn](args) — that tree isn't populated for
  // registry-style mutators.)
  const registry = mutators as unknown as Record<
    string,
    Record<string, (a: unknown) => unknown>
  >;
  const request = registry[ns][fn](args);
  const run = z.mutate as unknown as (req: unknown) => Promise<unknown>;
  return run(request);
}

function enqueue(name: string, args: unknown) {
  pendingWrites.update((q) => [
    ...q,
    { id: nanoid(), name, args, enqueuedAt: Date.now(), attempts: 0 },
  ]);
}

function isConnected(z: Z<Schema> | undefined): z is Z<Schema> {
  return !!z && z.connectionState.name === "connected";
}

async function enqueueOrRun(name: string, args: unknown): Promise<void> {
  const z = getZOrUndefined();
  if (isConnected(z)) {
    try {
      await runMutation(z, name, args);
      return;
    } catch (err) {
      // Surface the real reason, then queue for replay (bounded by MAX_ATTEMPTS).
      console.error(`Zero mutation "${name}" failed:`, err);
      enqueue(name, args);
      return;
    }
  }
  enqueue(name, args);
}

let draining = false;

export async function drainOutbox(): Promise<void> {
  const z = getZOrUndefined();
  if (draining || !isConnected(z)) return;
  draining = true;
  try {
    // Replay FIFO, one at a time, so dependent mutations keep their order.
    while (true) {
      const queue = get(pendingWrites);
      if (queue.length === 0 || !isConnected(getZOrUndefined())) break;
      const entry = queue[0];
      try {
        await runMutation(z, entry.name, entry.args);
        pendingWrites.update((q) => q.filter((e) => e.id !== entry.id));
      } catch (err) {
        console.error(`Zero outbox replay of "${entry.name}" failed:`, err);
        const attempts = entry.attempts + 1;
        if (attempts >= MAX_ATTEMPTS) {
          // Give up on this write so it can't wedge the queue forever.
          console.error(`Dropping outbox entry ${entry.name} after ${attempts} attempts`, err);
          pendingWrites.update((q) => q.filter((e) => e.id !== entry.id));
        } else {
          pendingWrites.update((q) =>
            q.map((e) => (e.id === entry.id ? { ...e, attempts } : e)),
          );
          break; // stop; retry on the next reconnect
        }
      }
    }
  } finally {
    draining = false;
  }
}

// Wire replay to connection changes. Idempotent — safe to call more than once.
let outboxStarted = false;
export function startOutbox(z: Z<Schema>) {
  if (outboxStarted) return;
  outboxStarted = true;
  z.connection.state.subscribe((state) => {
    if (state.name === "connected") void drainOutbox();
  });
  if (typeof window !== "undefined") {
    window.addEventListener("online", () => void drainOutbox());
  }
  void drainOutbox();
}

// Typed facade the UI calls instead of z.mutate directly, so every write is
// funnelled through the outbox.
export const zmutate = {
  session: {
    create: (a: CreateSessionArgs) => enqueueOrRun("session.create", a),
    update: (a: UpdateSessionArgs) => enqueueOrRun("session.update", a),
    delete: (a: { id: string }) => enqueueOrRun("session.delete", a),
  },
  exercise: {
    create: (a: CreateExerciseArgs) => enqueueOrRun("exercise.create", a),
    delete: (a: { id: string }) => enqueueOrRun("exercise.delete", a),
  },
  exerciseSet: {
    create: (a: CreateExerciseSetArgs) => enqueueOrRun("exerciseSet.create", a),
    delete: (a: { id: string }) => enqueueOrRun("exerciseSet.delete", a),
  },
  settings: {
    update: (a: UpdateSettingsArgs) => enqueueOrRun("settings.update", a),
  },
  exerciseType: {
    create: (a: CreateExerciseTypeArgs) => enqueueOrRun("exerciseType.create", a),
    update: (a: UpdateExerciseTypeArgs) => enqueueOrRun("exerciseType.update", a),
    delete: (a: { id: string; userId: string }) =>
      enqueueOrRun("exerciseType.delete", a),
  },
  template: {
    create: (a: CreateTemplateArgs) => enqueueOrRun("template.create", a),
    update: (a: UpdateTemplateArgs) => enqueueOrRun("template.update", a),
    delete: (a: { id: string }) => enqueueOrRun("template.delete", a),
  },
  equipment: {
    create: (a: CreateEquipmentArgs) => enqueueOrRun("equipment.create", a),
    update: (a: UpdateEquipmentArgs) => enqueueOrRun("equipment.update", a),
    delete: (a: { id: string; userId: string }) =>
      enqueueOrRun("equipment.delete", a),
  },
};
