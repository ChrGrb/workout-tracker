import { describe, it, expect } from "vitest";
import {
  getExerciseSetWeight,
  getExerciseSetScore,
} from "./getExerciseSetWeight";
import { makeExerciseSet } from "$lib/testing/fixtures";

describe("getExerciseSetWeight", () => {
  it("sums weight and additionalWeight", () => {
    expect(
      getExerciseSetWeight(makeExerciseSet({ weight: 60, additionalWeight: 20 })),
    ).toBe(80);
  });
});

describe("getExerciseSetScore", () => {
  it("sums weight, additionalWeight and time", () => {
    expect(
      getExerciseSetScore(
        makeExerciseSet({ weight: 60, additionalWeight: 20, time: 5 }),
      ),
    ).toBe(85);
  });

  it("is just time for a time-based set", () => {
    expect(
      getExerciseSetScore(
        makeExerciseSet({ weight: 0, additionalWeight: 0, time: 30 }),
      ),
    ).toBe(30);
  });
});
