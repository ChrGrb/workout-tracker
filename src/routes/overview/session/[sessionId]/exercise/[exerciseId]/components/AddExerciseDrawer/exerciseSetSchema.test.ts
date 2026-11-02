import { describe, it, expect } from "vitest";
import { getExerciseSetSchema, WeightTypeEnum } from "./exerciseSetSchema";

const schema = getExerciseSetSchema();

const issuesFor = (data: unknown) =>
  schema
    .safeParse(data)
    .error?.issues.map((issue) => [issue.path.join("."), issue.message]) ?? [];

describe("exerciseSetSchema", () => {
  it("requires reps and weight", () => {
    expect(issuesFor({ reps: null, weight: undefined })).toEqual([
      ["reps", "Value required"],
      ["weight", "Value required"],
    ]);
  });

  it("enforces the reps minimum", () => {
    expect(issuesFor({ reps: 0, weight: 10 }).map(([path]) => path)).toEqual([
      "reps",
    ]);
  });

  it("ignores an empty second weight for unified sets", () => {
    expect(issuesFor({ reps: 5, weight: 10, additionalWeight: null })).toEqual(
      [],
    );
  });

  it("requires the second weight for bilateral sets", () => {
    expect(
      issuesFor({ reps: 5, weight: 10, weightType: WeightTypeEnum.BILATERAL }),
    ).toEqual([["additionalWeight", "Value required"]]);
  });

  it("accepts a bilateral set with both weights", () => {
    expect(
      issuesFor({
        reps: 5,
        weight: 10,
        additionalWeight: 12,
        weightType: WeightTypeEnum.BILATERAL,
      }),
    ).toEqual([]);
  });

  it("defaults the weight type from the factory argument", () => {
    expect(
      getExerciseSetSchema(WeightTypeEnum.BILATERAL).parse({
        reps: 5,
        weight: 10,
        additionalWeight: 10,
      }).weightType,
    ).toBe(WeightTypeEnum.BILATERAL);
    expect(schema.parse({ reps: 5, weight: 10 }).weightType).toBe(
      WeightTypeEnum.UNIFIED,
    );
  });
});
