import { describe, it, expect } from "vitest";
import { createExercise } from "./create";
import { deleteExercise } from "./delete";
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
      { id: "e1", userId: "user-1", typeId: "t1", sessionId: "s1", createdAt: 5, score: 0 },
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
