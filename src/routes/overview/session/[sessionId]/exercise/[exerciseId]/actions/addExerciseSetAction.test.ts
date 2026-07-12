import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("$lib/zero/outbox", () => ({
  zmutate: { exerciseSet: { create: vi.fn().mockResolvedValue(undefined) } },
}));

import { zmutate } from "$lib/zero/outbox";
import addExerciseSetAction from "./addExerciseSetAction";
import type { ExerciseFull } from "$lib/utils/prismaTypes";

const exercise = { id: "e1" } as unknown as ExerciseFull;

beforeEach(() => vi.clearAllMocks());

describe("addExerciseSetAction", () => {
  it("fills defaults for omitted fields", async () => {
    await addExerciseSetAction(exercise, {});
    expect(zmutate.exerciseSet.create).toHaveBeenCalledWith(
      expect.objectContaining({
        exerciseId: "e1",
        exerciseSetType: "WORKOUT",
        reps: 1,
        weight: 0,
        additionalWeight: 0,
        time: 0,
        notes: "",
        id: expect.any(String),
        createdAt: expect.any(Number),
      }),
    );
  });

  it("passes provided values through", async () => {
    await addExerciseSetAction(exercise, {
      reps: 8,
      weight: 60,
      exerciseSetType: "WARMUP",
    });
    expect(zmutate.exerciseSet.create).toHaveBeenCalledWith(
      expect.objectContaining({ reps: 8, weight: 60, exerciseSetType: "WARMUP" }),
    );
  });
});
