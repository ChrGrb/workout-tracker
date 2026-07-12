import { describe, it, expect } from "vitest";
import { createSession } from "./create";
import { updateSession } from "./update";
import { deleteSession } from "./delete";
import { createFakeTx, runMutator } from "$lib/testing/fakeTx";

const ctx = { userID: "user-1" };

describe("createSession", () => {
  it("inserts a session with finished:false", async () => {
    const { tx, rows } = createFakeTx();
    await runMutator(createSession, {
      tx,
      ctx,
      args: { id: "s1", userId: "user-1", name: "Leg day", createdAt: 1000 },
    });
    expect(rows("workoutSession")).toEqual([
      { id: "s1", userId: "user-1", name: "Leg day", createdAt: 1000, finished: false },
    ]);
  });
});

describe("updateSession", () => {
  it("updates only the provided fields", async () => {
    const { tx, rows } = createFakeTx({
      workoutSession: [
        { id: "s1", userId: "user-1", name: "Old", createdAt: 1, finished: false },
      ],
    });
    await runMutator(updateSession, { tx, ctx, args: { id: "s1", finished: true } });
    expect(rows("workoutSession")[0]).toMatchObject({ name: "Old", finished: true });
  });
});

describe("deleteSession", () => {
  it("cascades: removes the session, its exercises, and their sets", async () => {
    const { tx, rows } = createFakeTx({
      workoutSession: [{ id: "s1" }, { id: "s2" }],
      exercise: [
        { id: "e1", sessionId: "s1" },
        { id: "e2", sessionId: "s1" },
        { id: "e3", sessionId: "s2" },
      ],
      exerciseSet: [
        { id: "set1", exerciseId: "e1" },
        { id: "set2", exerciseId: "e2" },
        { id: "set3", exerciseId: "e3" },
      ],
    });

    await runMutator(deleteSession, { tx, ctx, args: { id: "s1" } });

    expect(rows("workoutSession")).toEqual([{ id: "s2" }]);
    expect(rows("exercise")).toEqual([{ id: "e3", sessionId: "s2" }]);
    expect(rows("exerciseSet")).toEqual([{ id: "set3", exerciseId: "e3" }]);
  });
});
