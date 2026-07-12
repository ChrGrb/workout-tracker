import { describe, it, expect } from "vitest";
import { createExerciseType } from "./create";
import { updateExerciseType } from "./update";
import { deleteExerciseType } from "./delete";
import { createFakeTx, runMutator } from "$lib/testing/fakeTx";

const ctx = { userID: "user-1" };

describe("createExerciseType", () => {
  it("inserts the type and links it to the user", async () => {
    const { tx, rows } = createFakeTx();
    await runMutator(createExerciseType, {
      tx,
      ctx,
      args: { id: "ty1", userId: "user-1", name: "Bench", category: "WEIGHT", area: "CHEST", description: "d" },
    });
    expect(rows("exerciseType")).toEqual([
      { id: "ty1", name: "Bench", category: "WEIGHT", area: "CHEST", description: "d" },
    ]);
    expect(rows("_exerciseTypeToUser")).toEqual([{ A: "ty1", B: "user-1" }]);
  });

  it("enforces ownership on the server", async () => {
    const { tx } = createFakeTx({}, "server");
    await expect(
      runMutator(createExerciseType, {
        tx,
        ctx: { userID: "intruder" },
        args: { id: "ty1", userId: "user-1", name: "Bench", category: "WEIGHT" },
      }),
    ).rejects.toThrow("Not authorized");
  });
});

describe("updateExerciseType", () => {
  it("updates only the provided fields", async () => {
    const { tx, rows } = createFakeTx({
      exerciseType: [{ id: "ty1", name: "Old", category: "WEIGHT", area: "CHEST", description: null }],
    });
    await runMutator(updateExerciseType, { tx, ctx, args: { id: "ty1", name: "New" } });
    expect(rows("exerciseType")[0]).toMatchObject({ name: "New", area: "CHEST" });
  });
});

describe("deleteExerciseType", () => {
  it("unlinks and hard-deletes the type when no exercise references it", async () => {
    const { tx, rows } = createFakeTx({
      exerciseType: [{ id: "ty1" }],
      _exerciseTypeToUser: [{ A: "ty1", B: "user-1" }],
      exercise: [],
    });
    await runMutator(deleteExerciseType, { tx, ctx, args: { id: "ty1", userId: "user-1" } });
    expect(rows("_exerciseTypeToUser")).toEqual([]);
    expect(rows("exerciseType")).toEqual([]);
  });

  it("unlinks but KEEPS the type when an exercise still references it", async () => {
    const { tx, rows } = createFakeTx({
      exerciseType: [{ id: "ty1" }],
      _exerciseTypeToUser: [{ A: "ty1", B: "user-1" }],
      exercise: [{ id: "e1", typeId: "ty1" }],
    });
    await runMutator(deleteExerciseType, { tx, ctx, args: { id: "ty1", userId: "user-1" } });
    expect(rows("_exerciseTypeToUser")).toEqual([]);
    expect(rows("exerciseType")).toEqual([{ id: "ty1" }]);
  });
});
