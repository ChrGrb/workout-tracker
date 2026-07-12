import { describe, it, expect } from "vitest";
import { getAreaScoresFromExercises } from "./getAreaScoresFromExercises";
import {
  makeExerciseFull,
  makeExerciseSet,
  makeExerciseType,
} from "$lib/testing/fixtures";

describe("getAreaScoresFromExercises", () => {
  it("accumulates reps*(weight+additionalWeight)+time per muscle area", () => {
    const chestA = makeExerciseFull({
      type: makeExerciseType({ area: "CHEST" }),
      sets: [makeExerciseSet({ reps: 2, weight: 50, additionalWeight: 0, time: 0 })], // 100
    });
    const chestB = makeExerciseFull({
      type: makeExerciseType({ area: "CHEST" }),
      sets: [makeExerciseSet({ reps: 1, weight: 10, additionalWeight: 5, time: 3 })], // 18
    });
    const legs = makeExerciseFull({
      type: makeExerciseType({ area: "LEGS" }),
      sets: [makeExerciseSet({ reps: 3, weight: 20, additionalWeight: 0, time: 0 })], // 60
    });

    expect(getAreaScoresFromExercises([chestA, chestB, legs])).toEqual({
      CHEST: 118,
      LEGS: 60,
    });
  });

  it("ignores exercises whose type has no area", () => {
    const none = makeExerciseFull({
      type: makeExerciseType({ area: null }),
      sets: [makeExerciseSet({ reps: 1, weight: 10, additionalWeight: 0, time: 0 })],
    });
    expect(getAreaScoresFromExercises([none])).toEqual({});
  });

  it("skips sets with null reps", () => {
    const ex = makeExerciseFull({
      type: makeExerciseType({ area: "BACK" }),
      sets: [
        makeExerciseSet({ reps: null as unknown as number, weight: 100, additionalWeight: 0, time: 0 }),
        makeExerciseSet({ reps: 2, weight: 10, additionalWeight: 0, time: 0 }), // 20
      ],
    });
    expect(getAreaScoresFromExercises([ex])).toEqual({ BACK: 20 });
  });
});
