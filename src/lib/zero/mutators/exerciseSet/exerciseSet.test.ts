import { describe, it, expect } from "vitest";
import { createExerciseSet } from "./create";
import { deleteExerciseSet } from "./delete";
import { updateExerciseSet, type UpdateExerciseSetArgs } from "./update";
import { EXERCISE_SET_LIMITS } from "./validation";
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

describe("updateExerciseSet", () => {
  const originalSet = {
    id: "set1",
    exerciseId: "e1",
    exerciseSetType: "WORKOUT",
    reps: 8,
    weight: 60,
    additionalWeight: 0,
    time: 30,
    notes: "",
    createdAt: 42,
  };
  const seed = () => ({
    exercise: [{ id: "e1", userId: "user-1" }],
    exerciseSet: [{ ...originalSet }],
  });

  it("lets the owner update the set on the server", async () => {
    const { tx, rows } = createFakeTx(seed(), "server");
    await runMutator(updateExerciseSet, {
      tx,
      ctx,
      args: {
        id: "set1",
        exerciseSetType: "WARMUP",
        reps: 10,
        weight: 62.5,
        additionalWeight: 5,
        notes: "heavier",
      },
    });
    expect(rows("exerciseSet")).toEqual([
      {
        ...originalSet,
        exerciseSetType: "WARMUP",
        reps: 10,
        weight: 62.5,
        additionalWeight: 5,
        notes: "heavier",
      },
    ]);
  });

  it("rejects a different user on the server and writes nothing", async () => {
    const { tx, rows } = createFakeTx(seed(), "server");
    await expect(
      runMutator(updateExerciseSet, {
        tx,
        ctx: { userID: "intruder" },
        args: { id: "set1", reps: 99 },
      }),
    ).rejects.toThrow(new Error("Not authorized"));
    expect(rows("exerciseSet")).toEqual([originalSet]);
  });

  it("rejects a missing set on the server", async () => {
    const { tx, rows } = createFakeTx(seed(), "server");
    await expect(
      runMutator(updateExerciseSet, { tx, ctx, args: { id: "nope", reps: 9 } }),
    ).rejects.toThrow(new Error("Not authorized"));
    expect(rows("exerciseSet")).toEqual([originalSet]);
  });

  it("rejects a set whose exercise is missing on the server", async () => {
    const { tx, rows } = createFakeTx(
      { exercise: [], exerciseSet: [{ ...originalSet }] },
      "server",
    );
    await expect(
      runMutator(updateExerciseSet, { tx, ctx, args: { id: "set1", reps: 9 } }),
    ).rejects.toThrow(new Error("Not authorized"));
    expect(rows("exerciseSet")).toEqual([originalSet]);
  });

  it("rejects a missing ctx on the server", async () => {
    const { tx, rows } = createFakeTx(seed(), "server");
    await expect(
      runMutator(updateExerciseSet, {
        tx,
        ctx: undefined,
        args: { id: "set1", reps: 9 },
      }),
    ).rejects.toThrow(new Error("Not authorized"));
    expect(rows("exerciseSet")).toEqual([originalSet]);
  });

  it("does not write extra arg fields such as exerciseId, createdAt, time", async () => {
    const { tx, rows } = createFakeTx(
      {
        exercise: [
          { id: "e1", userId: "user-1" },
          { id: "e-foreign", userId: "intruder" },
        ],
        exerciseSet: [{ ...originalSet }],
      },
      "server",
    );
    await runMutator(updateExerciseSet, {
      tx,
      ctx,
      args: {
        id: "set1",
        reps: 12,
        exerciseId: "e-foreign",
        createdAt: 0,
        time: 999,
      } as unknown as UpdateExerciseSetArgs,
    });
    expect(rows("exerciseSet")).toEqual([{ ...originalSet, reps: 12 }]);
  });

  it("only changes the provided fields", async () => {
    const { tx, rows } = createFakeTx(seed(), "server");
    await runMutator(updateExerciseSet, {
      tx,
      ctx,
      args: { id: "set1", notes: "only notes" },
    });
    expect(rows("exerciseSet")).toEqual([
      { ...originalSet, notes: "only notes" },
    ]);
  });

  it("accepts boundary values on the server", async () => {
    const longId = "x".repeat(64);
    const { tx, rows } = createFakeTx(
      {
        exercise: [{ id: "e1", userId: "user-1" }],
        exerciseSet: [{ ...originalSet, id: longId }],
      },
      "server",
    );
    const args = {
      id: longId,
      reps: EXERCISE_SET_LIMITS.maxReps,
      weight: 0,
      additionalWeight: EXERCISE_SET_LIMITS.maxWeight,
      notes: "n".repeat(EXERCISE_SET_LIMITS.maxNotes),
    };
    await runMutator(updateExerciseSet, { tx, ctx, args });
    expect(rows("exerciseSet")).toEqual([{ ...originalSet, ...args }]);
  });

  const invalidCases: [string, Record<string, unknown>][] = [
    ["reps 1.5", { id: "set1", reps: 1.5 }],
    ["reps 0", { id: "set1", reps: 0 }],
    ["reps above max", { id: "set1", reps: EXERCISE_SET_LIMITS.maxReps + 1 }],
    ['reps "5"', { id: "set1", reps: "5" }],
    ["weight null", { id: "set1", weight: null }],
    ["weight Infinity", { id: "set1", weight: Infinity }],
    ["weight NaN", { id: "set1", weight: NaN }],
    ["weight -1", { id: "set1", weight: -1 }],
    ["weight 2001", { id: "set1", weight: 2001 }],
    ['weight "60"', { id: "set1", weight: "60" }],
    ["additionalWeight 2001", { id: "set1", additionalWeight: 2001 }],
    ["additionalWeight -0.5", { id: "set1", additionalWeight: -0.5 }],
    ["additionalWeight null", { id: "set1", additionalWeight: null }],
    ["notes 2001 chars", { id: "set1", notes: "a".repeat(2001) }],
    ["notes as object", { id: "set1", notes: { toString: () => "x" } }],
    ["notes null", { id: "set1", notes: null }],
    ["exerciseSetType unknown", { id: "set1", exerciseSetType: "HACK" }],
    ["id as number", { id: 1, reps: 5 }],
    ["id empty", { id: "", reps: 5 }],
    ["id 65 chars", { id: "x".repeat(65), reps: 5 }],
  ];

  for (const location of ["client", "server"] as const) {
    for (const [name, args] of invalidCases) {
      it(`rejects ${name} on the ${location} and writes nothing`, async () => {
        const { tx, rows } = createFakeTx(seed(), location);
        await expect(
          runMutator(updateExerciseSet, {
            tx,
            ctx,
            args: args as unknown as UpdateExerciseSetArgs,
          }),
        ).rejects.toThrow(new Error("Invalid exercise set"));
        expect(rows("exerciseSet")).toEqual([originalSet]);
      });
    }
  }

  it("skips the ownership lookup on the client (set not in the store)", async () => {
    const { tx, rows } = createFakeTx({}, "client");
    await expect(
      runMutator(updateExerciseSet, {
        tx,
        ctx: { userID: "someone-else" },
        args: { id: "not-local", reps: 5 },
      }),
    ).resolves.toBeUndefined();
    expect(rows("exerciseSet")).toEqual([]);
  });

  it("does not enforce ownership on the client", async () => {
    const { tx, rows } = createFakeTx(seed(), "client");
    await runMutator(updateExerciseSet, {
      tx,
      ctx: { userID: "intruder" },
      args: { id: "set1", reps: 3 },
    });
    expect(rows("exerciseSet")).toEqual([{ ...originalSet, reps: 3 }]);
  });
});
