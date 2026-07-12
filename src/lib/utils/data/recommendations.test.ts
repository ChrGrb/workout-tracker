import { describe, it, expect } from "vitest";
import { getRecommendations } from "./recommendations";
import { makeExerciseFull, makeExerciseSet } from "$lib/testing/fixtures";

describe("getRecommendations", () => {
  const current = makeExerciseFull({ typeId: "t1", createdAt: new Date(1000) });

  it("averages weight and reps over the relevant prior sets", () => {
    const prior = makeExerciseFull({
      typeId: "t1",
      createdAt: new Date(10),
      sets: [
        makeExerciseSet({ weight: 100, additionalWeight: 0, reps: 5 }), // weight 100
        makeExerciseSet({ weight: 50, additionalWeight: 10, reps: 10 }), // weight 60
      ],
    });
    // Different type + a future-dated same-type exercise are both excluded.
    const otherType = makeExerciseFull({ typeId: "t2", createdAt: new Date(20), sets: [makeExerciseSet({ weight: 999, reps: 99 })] });
    const future = makeExerciseFull({ typeId: "t1", createdAt: new Date(9999), sets: [makeExerciseSet({ weight: 999, reps: 99 })] });

    expect(getRecommendations(current, [prior, otherType, future])).toEqual({
      averageWeight: 80,
      averageReps: 7.5,
    });
  });

  it("returns null when there are no relevant prior exercises", () => {
    expect(getRecommendations(current, [])).toBeNull();
    const onlyOtherType = makeExerciseFull({ typeId: "t2", createdAt: new Date(1), sets: [makeExerciseSet()] });
    expect(getRecommendations(current, [onlyOtherType])).toBeNull();
  });
});
