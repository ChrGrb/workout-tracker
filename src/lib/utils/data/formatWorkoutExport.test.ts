import { describe, it, expect } from "vitest";
import { formatWorkoutForExport } from "./formatWorkoutExport";
import {
  makeSessionFull,
  makeExerciseFull,
  makeExerciseType,
  makeExerciseSet,
} from "$lib/testing/fixtures";

describe("formatWorkoutForExport", () => {
  it("lists exercises with equipment (not muscle group) and their sets", () => {
    const session = makeSessionFull({
      name: "Push Day",
      exercises: [
        makeExerciseFull({
          createdAt: new Date(1),
          type: makeExerciseType({
            name: "Bench Press",
            area: "CHEST",
            equipment: {
              id: "e1",
              userId: "u",
              name: "Barbell",
              createdAt: new Date(0),
            },
          }),
          sets: [
            makeExerciseSet({ reps: 8, weight: 60, createdAt: new Date(1) }),
            makeExerciseSet({ reps: 7, weight: 62, createdAt: new Date(2) }),
          ],
        }),
        makeExerciseFull({
          createdAt: new Date(2),
          type: makeExerciseType({ name: "Plank", area: "CORE", equipment: null }),
          sets: [makeExerciseSet({ time: 45000, createdAt: new Date(1) })],
        }),
      ],
    });

    const out = formatWorkoutForExport(session);

    expect(out).toContain("Push Day");
    expect(out).toContain("Bench Press (Barbell)");
    expect(out).toContain("- 60 kg × 8");
    expect(out).toContain("- 62 kg × 7");
    expect(out).toContain("Plank");
    expect(out).toContain("- 45 s");
    // Muscle group must NOT be included.
    expect(out).not.toContain("Chest");
    expect(out).not.toContain("Core");
    // Bench (createdAt 1) comes before Plank (createdAt 2).
    expect(out.indexOf("Bench Press")).toBeLessThan(out.indexOf("Plank"));
  });

  it("labels non-workout sets and renders bodyweight sets as reps", () => {
    const session = makeSessionFull({
      name: "S",
      exercises: [
        makeExerciseFull({
          type: makeExerciseType({ name: "Pushup", equipment: null }),
          sets: [
            makeExerciseSet({
              reps: 10,
              weight: 0,
              exerciseSetType: "WARMUP",
              createdAt: new Date(1),
            }),
          ],
        }),
      ],
    });

    expect(formatWorkoutForExport(session)).toContain("- 10 reps (warmup)");
  });
});
