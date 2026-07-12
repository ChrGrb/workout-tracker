// @vitest-environment jsdom
// Runs in jsdom because the outbox uses a localStorage-backed persisted store.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { get } from "svelte/store";

const fakeZ = {
  connectionState: { name: "connected" as string },
  mutate: vi.fn(),
};
let currentZ: unknown = fakeZ;

vi.mock("$lib/zero/z.svelte", () => ({
  getZOrUndefined: () => currentZ,
}));
vi.mock("$lib/zero/mutators", () => ({
  // runMutation does registry[ns][fn](args) then z.mutate(request); the request
  // shape is irrelevant here — we only assert on z.mutate being called.
  mutators: {
    session: { create: (a: unknown) => a },
    exercise: { create: (a: unknown) => a },
  },
}));

import { zmutate, pendingWrites, drainOutbox } from "$lib/zero/outbox";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const anyArgs = { id: "s1" } as any;

beforeEach(() => {
  vi.clearAllMocks();
  pendingWrites.set([]);
  currentZ = fakeZ;
  fakeZ.connectionState.name = "connected";
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe("zmutate / enqueueOrRun", () => {
  it("runs immediately when connected and does not enqueue", async () => {
    await zmutate.session.create(anyArgs);
    expect(fakeZ.mutate).toHaveBeenCalledTimes(1);
    expect(get(pendingWrites)).toHaveLength(0);
  });

  it("enqueues when there is no connected client", async () => {
    currentZ = undefined;
    await zmutate.session.create(anyArgs);
    expect(fakeZ.mutate).not.toHaveBeenCalled();
    expect(get(pendingWrites)).toHaveLength(1);
    expect(get(pendingWrites)[0]).toMatchObject({ name: "session.create", attempts: 0 });
  });

  it("enqueues when the immediate run throws", async () => {
    fakeZ.mutate.mockRejectedValueOnce(new Error("boom"));
    await zmutate.session.create(anyArgs);
    expect(get(pendingWrites)).toHaveLength(1);
  });
});

describe("drainOutbox", () => {
  it("replays FIFO and clears entries on success", async () => {
    pendingWrites.set([
      { id: "o1", name: "session.create", args: { a: 1 }, enqueuedAt: 0, attempts: 0 },
      { id: "o2", name: "exercise.create", args: { a: 2 }, enqueuedAt: 0, attempts: 0 },
    ]);
    await drainOutbox();
    expect(fakeZ.mutate).toHaveBeenCalledTimes(2);
    expect(get(pendingWrites)).toHaveLength(0);
  });

  it("increments attempts and keeps the entry on failure (below the cap)", async () => {
    pendingWrites.set([
      { id: "o1", name: "session.create", args: {}, enqueuedAt: 0, attempts: 0 },
    ]);
    fakeZ.mutate.mockRejectedValue(new Error("boom"));
    await drainOutbox();
    const q = get(pendingWrites);
    expect(q).toHaveLength(1);
    expect(q[0].attempts).toBe(1);
  });

  it("drops an entry once it reaches MAX_ATTEMPTS", async () => {
    pendingWrites.set([
      { id: "o1", name: "session.create", args: {}, enqueuedAt: 0, attempts: 9 },
    ]);
    fakeZ.mutate.mockRejectedValue(new Error("boom"));
    await drainOutbox();
    expect(get(pendingWrites)).toHaveLength(0);
  });
});
