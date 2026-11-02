import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("$lib/zero/outbox", () => ({
  zmutate: { exerciseSet: { update: vi.fn().mockResolvedValue(undefined) } },
}));

import { zmutate } from "$lib/zero/outbox";
import { makeExerciseSet } from "$lib/testing/fixtures";
import updateExerciseSetAction, {
  type ExerciseSetFormValues,
} from "./updateExerciseSetAction";

beforeEach(() => vi.clearAllMocks());

const set = () =>
  makeExerciseSet({
    id: "set-1",
    exerciseSetType: "WORKOUT",
    reps: 8,
    weight: 30,
    additionalWeight: 30,
    notes: "ok",
  });

const values = (
  overrides: Partial<ExerciseSetFormValues> = {},
): ExerciseSetFormValues => ({
  exerciseSetType: "WORKOUT",
  reps: 8,
  weight: 30,
  additionalWeight: 30,
  notes: "ok",
  weightType: "BILATERAL",
  ...overrides,
});

describe("updateExerciseSetAction", () => {
  it("does nothing when no field changed", async () => {
    await updateExerciseSetAction(set(), values({ notes: " ok " }));
    expect(zmutate.exerciseSet.update).not.toHaveBeenCalled();
  });

  it("sends only the changed fields", async () => {
    await updateExerciseSetAction(
      set(),
      values({ reps: 10, exerciseSetType: "WARMUP" }),
    );
    expect(zmutate.exerciseSet.update).toHaveBeenCalledWith({
      id: "set-1",
      reps: 10,
      exerciseSetType: "WARMUP",
    });
  });

  it("forces the second weight to 0 for unified sets", async () => {
    await updateExerciseSetAction(
      set(),
      values({ weightType: "UNIFIED", additionalWeight: 30 }),
    );
    expect(zmutate.exerciseSet.update).toHaveBeenCalledWith({
      id: "set-1",
      additionalWeight: 0,
    });
  });
});
