import { describe, it, expect } from "vitest";
import calculateExerciseScore from "./calculateExerciseScore";
import { makeExerciseFull, makeExerciseSet } from "$lib/testing/fixtures";

describe("calculateExerciseScore", () => {
  it("sums (weight+additionalWeight+time)*reps over WORKOUT sets only", () => {
    const exercise = makeExerciseFull({
      sets: [
        makeExerciseSet({ exerciseSetType: "WORKOUT", weight: 50, additionalWeight: 10, time: 0, reps: 2 }), // 120
        makeExerciseSet({ exerciseSetType: "WORKOUT", weight: 100, additionalWeight: 0, time: 0, reps: 1 }), // 100
        makeExerciseSet({ exerciseSetType: "WARMUP", weight: 999, additionalWeight: 0, time: 0, reps: 5 }), // ignored
      ],
    });
    expect(calculateExerciseScore(exercise)).toBe(220);
  });

  it("returns 0 when there are no sets", () => {
    expect(calculateExerciseScore(makeExerciseFull({ sets: [] }))).toBe(0);
  });
});
