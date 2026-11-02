import { describe, it, expect } from "vitest";
import { z } from "zod";
import { zod4 } from "sveltekit-superforms/adapters";
import { getEnumOptions } from "./getEnumOptions";
import { getExerciseSetSchema } from "../../../routes/overview/session/[sessionId]/exercise/[exerciseId]/components/AddExerciseDrawer/exerciseSetSchema";

const jsonSchemaOf = (schema: z.ZodObject) => zod4(schema).jsonSchema;

describe("getEnumOptions", () => {
  it("uses the labels from the schema meta in enum order", () => {
    const jsonSchema = zod4(getExerciseSetSchema()).jsonSchema;

    expect(getEnumOptions(jsonSchema, "exerciseSetType")).toEqual([
      { value: "WARMUP", name: "Warmup" },
      { value: "WORKOUT", name: "Workout" },
      { value: "COOLDOWN", name: "Cooldown" },
    ]);
  });

  it("falls back to title case without labels", () => {
    const jsonSchema = jsonSchemaOf(
      z.object({ side: z.enum(["LEFT_SIDE", "RIGHT"]) }),
    );

    expect(getEnumOptions(jsonSchema, "side")).toEqual([
      { value: "LEFT_SIDE", name: "Left side" },
      { value: "RIGHT", name: "Right" },
    ]);
  });

  it("finds nullable enums", () => {
    const jsonSchema = jsonSchemaOf(
      z.object({
        side: z
          .enum(["LEFT", "RIGHT"])
          .nullable()
          .meta({ labels: { LEFT: "Links" } }),
      }),
    );

    expect(getEnumOptions(jsonSchema, "side")).toEqual([
      { value: "LEFT", name: "Links" },
      { value: "RIGHT", name: "Right" },
    ]);
  });

  it("resolves nested paths", () => {
    const jsonSchema = jsonSchemaOf(
      z.object({ a: z.object({ b: z.enum(["X", "Y"]) }) }),
    );

    expect(getEnumOptions(jsonSchema, "a.b").map((o) => o.value)).toEqual([
      "X",
      "Y",
    ]);
  });

  it("throws for fields that are not enums", () => {
    const jsonSchema = zod4(getExerciseSetSchema()).jsonSchema;

    expect(() => getEnumOptions(jsonSchema, "reps")).toThrow(/not an enum/);
    expect(() => getEnumOptions(jsonSchema, "missing")).toThrow(/not an enum/);
  });
});
