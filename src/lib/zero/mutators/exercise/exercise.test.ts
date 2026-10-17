import { describe, it, expect } from "vitest";
import { createExercise } from "./create";
import { deleteExercise } from "./delete";
import { updateExercise } from "./update";
import { createFakeTx, runMutator } from "$lib/testing/fakeTx";

const ctx = { userID: "user-1" };

describe("createExercise", () => {
  it("inserts an exercise with score 0", async () => {
    const { tx, rows } = createFakeTx();
    await runMutator(createExercise, {
      tx,
      ctx,
      args: { id: "e1", userId: "user-1", typeId: "t1", sessionId: "s1", createdAt: 5 },
    });
    expect(rows("exercise")).toEqual([
      { id: "e1", userId: "user-1", typeId: "t1", sessionId: "s1", createdAt: 5, score: 0, notes: "" },
    ]);
  });

  it("throws on the server when ctx user differs from args.userId", async () => {
    const { tx } = createFakeTx({}, "server");
    await expect(
      runMutator(createExercise, {
        tx,
        ctx: { userID: "intruder" },
        args: { id: "e1", userId: "user-1", typeId: "t1", sessionId: "s1", createdAt: 5 },
      }),
    ).rejects.toThrow("Not authorized");
  });

  it("does not enforce ownership on the client", async () => {
    const { tx, rows } = createFakeTx({}, "client");
    await runMutator(createExercise, {
      tx,
      ctx: { userID: "intruder" },
      args: { id: "e1", userId: "user-1", typeId: "t1", sessionId: "s1", createdAt: 5 },
    });
    expect(rows("exercise")).toHaveLength(1);
  });
});

describe("deleteExercise", () => {
  it("deletes the exercise and only its own sets", async () => {
    const { tx, rows } = createFakeTx({
      exercise: [{ id: "e1" }, { id: "e2" }],
      exerciseSet: [
        { id: "s1", exerciseId: "e1" },
        { id: "s2", exerciseId: "e1" },
        { id: "s3", exerciseId: "e2" },
      ],
    });
    await runMutator(deleteExercise, { tx, ctx, args: { id: "e1" } });
    expect(rows("exercise")).toEqual([{ id: "e2" }]);
    expect(rows("exerciseSet")).toEqual([{ id: "s3", exerciseId: "e2" }]);
  });
});

describe("updateExercise", () => {
  const seed = () => ({
    exercise: [
      { id: "e1", userId: "user-1", typeId: "t1", sessionId: "s1", notes: "" },
    ],
  });

  it("sets notes", async () => {
    const { tx, rows } = createFakeTx(seed());
    await runMutator(updateExercise, { tx, ctx, args: { id: "e1", notes: "good form" } });
    expect(rows("exercise")[0]).toEqual({
      id: "e1",
      userId: "user-1",
      typeId: "t1",
      sessionId: "s1",
      notes: "good form",
    });
  });

  it("succeeds on the server for the owner", async () => {
    const { tx, rows } = createFakeTx(seed(), "server");
    await runMutator(updateExercise, { tx, ctx, args: { id: "e1", notes: "n" } });
    expect(rows("exercise")[0]).toMatchObject({ notes: "n" });
  });

  it("rejects a different user on the server and writes nothing", async () => {
    const { tx, rows } = createFakeTx(seed(), "server");
    await expect(
      runMutator(updateExercise, {
        tx,
        ctx: { userID: "intruder" },
        args: { id: "e1", notes: "pwned" },
      }),
    ).rejects.toThrow(new Error("Not authorized"));
    expect(rows("exercise")[0]).toMatchObject({ notes: "" });
  });

  it("rejects a missing ctx on the server", async () => {
    const { tx, rows } = createFakeTx(seed(), "server");
    await expect(
      runMutator(updateExercise, { tx, ctx: undefined, args: { id: "e1", notes: "x" } }),
    ).rejects.toThrow(new Error("Not authorized"));
    expect(rows("exercise")[0]).toMatchObject({ notes: "" });
  });

  it("rejects a missing row on the server", async () => {
    const { tx, rows } = createFakeTx(seed(), "server");
    await expect(
      runMutator(updateExercise, { tx, ctx, args: { id: "nope", notes: "x" } }),
    ).rejects.toThrow(new Error("Not authorized"));
    expect(rows("exercise")).toHaveLength(1);
  });

  it("does not write extra arg fields such as userId", async () => {
    const { tx, rows } = createFakeTx(seed(), "server");
    await runMutator(updateExercise, {
      tx,
      ctx,
      args: {
        id: "e1",
        notes: "n",
        userId: "intruder",
        sessionId: "s9",
        typeId: "t9",
      } as unknown as { id: string; notes: string },
    });
    expect(rows("exercise")[0]).toEqual({
      id: "e1",
      userId: "user-1",
      typeId: "t1",
      sessionId: "s1",
      notes: "n",
    });
  });

  it("does not enforce ownership on the client", async () => {
    const { tx, rows } = createFakeTx(seed(), "client");
    await runMutator(updateExercise, {
      tx,
      ctx: { userID: "intruder" },
      args: { id: "e1", notes: "local" },
    });
    expect(rows("exercise")[0]).toMatchObject({ notes: "local" });
  });
});
