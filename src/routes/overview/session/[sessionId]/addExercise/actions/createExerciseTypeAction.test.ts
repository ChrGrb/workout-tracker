import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("$lib/zero/outbox", () => ({
  zmutate: { exerciseType: { create: vi.fn() } },
}));

import { zmutate } from "$lib/zero/outbox";
import createExerciseTypeAction from "./createExerciseTypeAction";

beforeEach(() => vi.clearAllMocks());

describe("createExerciseTypeAction", () => {
  it("normalizes an empty area string to undefined", () => {
    createExerciseTypeAction("user-1", "Bench", "", "WEIGHT", null);
    expect(zmutate.exerciseType.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        name: "Bench",
        category: "WEIGHT",
        area: undefined,
        description: "",
        equipmentId: undefined,
        id: expect.any(String),
      }),
    );
  });

  it("passes a real area through", () => {
    createExerciseTypeAction("user-1", "Squat", "LEGS", "WEIGHT", null);
    expect(zmutate.exerciseType.create).toHaveBeenCalledWith(
      expect.objectContaining({ area: "LEGS" }),
    );
  });

  it("passes a selected equipment id through", () => {
    createExerciseTypeAction("user-1", "Leg Press", "LEGS", "WEIGHT", "eq1");
    expect(zmutate.exerciseType.create).toHaveBeenCalledWith(
      expect.objectContaining({ equipmentId: "eq1" }),
    );
  });
});
