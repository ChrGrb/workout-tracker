import { describe, it, expect } from "vitest";
import { createExerciseSet } from "./create";
import { deleteExerciseSet } from "./delete";
import { createFakeTx, runMutator } from "$lib/testing/fakeTx";

const ctx = { userID: "user-1" };

describe("createExerciseSet", () => {
  it("inserts the set verbatim", async () => {
    const { tx, rows } = createFakeTx();
    const args = {
      id: "set1",
      exerciseId: "e1",
      exerciseSetType: "WORKOUT" as const,
      reps: 8,
      weight: 60,
      additionalWeight: 0,
      time: 0,
      notes: "felt good",
      createdAt: 42,
    };
    await runMutator(createExerciseSet, { tx, ctx, args });
    expect(rows("exerciseSet")).toEqual([args]);
  });
});

describe("deleteExerciseSet", () => {
  it("removes the matching set", async () => {
    const { tx, rows } = createFakeTx({
      exerciseSet: [{ id: "set1" }, { id: "set2" }],
    });
    await runMutator(deleteExerciseSet, { tx, ctx, args: { id: "set1" } });
    expect(rows("exerciseSet")).toEqual([{ id: "set2" }]);
  });
});
