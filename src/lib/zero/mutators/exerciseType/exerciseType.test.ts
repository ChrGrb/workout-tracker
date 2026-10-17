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

  it("succeeds on the server for a new id", async () => {
    const { tx, rows } = createFakeTx({ exerciseType: [] }, "server");
    await runMutator(createExerciseType, {
      tx,
      ctx,
      args: { id: "ty1", userId: "user-1", name: "Bench", category: "WEIGHT" },
    });
    expect(rows("exerciseType")).toHaveLength(1);
    expect(rows("_exerciseTypeToUser")).toEqual([{ A: "ty1", B: "user-1" }]);
  });

  it("rejects an existing type id on the server and does not link the caller", async () => {
    const { tx, rows } = createFakeTx(
      {
        exerciseType: [{ id: "ty1", name: "Theirs", category: "WEIGHT" }],
        _exerciseTypeToUser: [{ A: "ty1", B: "owner" }],
      },
      "server",
    );
    await expect(
      runMutator(createExerciseType, {
        tx,
        ctx,
        args: { id: "ty1", userId: "user-1", name: "Mine", category: "WEIGHT" },
      }),
    ).rejects.toThrow(new Error("Not authorized"));
    expect(rows("_exerciseTypeToUser")).toEqual([{ A: "ty1", B: "owner" }]);
    expect(rows("exerciseType")).toEqual([{ id: "ty1", name: "Theirs", category: "WEIGHT" }]);
  });
});

describe("updateExerciseType", () => {
  const seed = () => ({
    exerciseType: [{ id: "ty1", name: "Old", category: "WEIGHT", area: "CHEST", description: null }],
    _exerciseTypeToUser: [{ A: "ty1", B: "user-1" }],
  });

  it("updates only the provided fields", async () => {
    const { tx, rows } = createFakeTx(seed());
    await runMutator(updateExerciseType, { tx, ctx, args: { id: "ty1", name: "New" } });
    expect(rows("exerciseType")[0]).toMatchObject({ name: "New", area: "CHEST" });
  });

  it("succeeds on the server when the ctx user is linked to the type", async () => {
    const { tx, rows } = createFakeTx(seed(), "server");
    await runMutator(updateExerciseType, {
      tx,
      ctx,
      args: { id: "ty1", description: "machine height 4" },
    });
    expect(rows("exerciseType")[0]).toMatchObject({
      name: "Old",
      description: "machine height 4",
    });
  });

  it("rejects on the server when the ctx user is not linked to the type", async () => {
    const s = seed();
    // Another user's link to the same type must not count.
    s._exerciseTypeToUser = [{ A: "ty1", B: "owner" }, { A: "ty2", B: "intruder" }];
    const { tx, rows } = createFakeTx(s, "server");
    await expect(
      runMutator(updateExerciseType, {
        tx,
        ctx: { userID: "intruder" },
        args: { id: "ty1", description: "pwned" },
      }),
    ).rejects.toThrow(new Error("Not authorized"));
    expect(rows("exerciseType")[0]).toMatchObject({ description: null });
  });

  it("rejects on the server without ctx", async () => {
    const { tx, rows } = createFakeTx(seed(), "server");
    await expect(
      runMutator(updateExerciseType, {
        tx,
        ctx: undefined,
        args: { id: "ty1", description: "x" },
      }),
    ).rejects.toThrow(new Error("Not authorized"));
    expect(rows("exerciseType")[0]).toMatchObject({ description: null });
  });

  it("does not enforce ownership on the client", async () => {
    const { tx, rows } = createFakeTx(
      { exerciseType: [{ id: "ty1", name: "Old" }], _exerciseTypeToUser: [] },
      "client",
    );
    await runMutator(updateExerciseType, {
      tx,
      ctx: { userID: "intruder" },
      args: { id: "ty1", name: "Local" },
    });
    expect(rows("exerciseType")[0]).toMatchObject({ name: "Local" });
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
