import { describe, it, expect } from "vitest";
import {
  getOverviewPath,
  getExercisePath,
  getAddExerciseSetPath,
  getAddExerciseTypePath,
  getAddExercisePath,
  getAddTemplatePath,
} from "./routes";

describe("routes", () => {
  it("builds the expected paths", () => {
    expect(getOverviewPath).toBe("/overview");
    expect(getExercisePath({ sessionId: "s1", exerciseId: "e1" })).toBe(
      "/overview/session/s1/exercise/e1",
    );
    expect(getAddExerciseSetPath({ sessionId: "s1", exerciseId: "e1" })).toBe(
      "/overview/session/s1/exercise/e1/addSet",
    );
    expect(getAddExercisePath({ sessionId: "s1" })).toBe(
      "/overview/session/s1/addExercise",
    );
    expect(getAddExerciseTypePath).toBe("/overview/addExerciseType");
    expect(getAddTemplatePath).toBe(
      "/overview/template/addWorkoutSessionTemplate",
    );
  });
});
