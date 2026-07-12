import { describe, it, expect } from "vitest";
import { getPreviousExercisesOfType } from "./previousExercisesOfType";
import { makeExerciseFull } from "$lib/testing/fixtures";

describe("getPreviousExercisesOfType", () => {
  const current = makeExerciseFull({ typeId: "t1", createdAt: new Date(100) });

  it("keeps only same-type exercises created strictly before the current one", () => {
    const sameEarlier = makeExerciseFull({ id: "a", typeId: "t1", createdAt: new Date(50) });
    const otherType = makeExerciseFull({ id: "b", typeId: "t2", createdAt: new Date(50) });
    const sameLater = makeExerciseFull({ id: "c", typeId: "t1", createdAt: new Date(200) });
    const sameSameTime = makeExerciseFull({ id: "d", typeId: "t1", createdAt: new Date(100) });

    const result = getPreviousExercisesOfType(
      [sameEarlier, otherType, sameLater, sameSameTime],
      current,
    );
    expect(result.map((e) => e.id)).toEqual(["a"]);
  });
});
