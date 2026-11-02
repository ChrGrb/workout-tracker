import { z } from "zod";
import { EXERCISE_SET_LIMITS } from "$lib/zero/mutators/exerciseSet/validation";

export enum WeightTypeEnum {
  UNIFIED = "UNIFIED",
  BILATERAL = "BILATERAL",
}

export enum ExerciseSetTypeEnum {
  WARMUP = "WARMUP",
  WORKOUT = "WORKOUT",
  COOLDOWN = "COOLDOWN",
}

// Number inputs bind to `null` when cleared (Svelte 5), so fields are nullish
// and "required" is enforced by a refine instead of the base type.
// Limits mirror the server-side check in the exerciseSet mutators.
const numberSchema = (
  min = 0,
  max: number = EXERCISE_SET_LIMITS.maxWeight,
  { optional = false, integer = false } = {},
) => {
  let schema = (integer ? z.number().int() : z.number())
    .min(min)
    .max(max)
    .nullish();

  if (!optional) {
    schema = schema.refine((value) => value != null, {
      error: "Value required",
    });
  }

  return schema;
};

export const getExerciseSetSchema = (
  defaultExerciseWeightType?: WeightTypeEnum,
) =>
  z
    .object({
      reps: numberSchema(1, EXERCISE_SET_LIMITS.maxReps, { integer: true }),
      weight: numberSchema(),
      additionalWeight: numberSchema(undefined, undefined, { optional: true }),
      notes: z.string().max(EXERCISE_SET_LIMITS.maxNotes).default(""),
      exerciseSetType: z
        .enum(ExerciseSetTypeEnum)
        .meta({
          labels: {
            WARMUP: "Warmup",
            WORKOUT: "Workout",
            COOLDOWN: "Cooldown",
          },
        })
        .default(ExerciseSetTypeEnum.WORKOUT),
      weightType: z
        .enum(WeightTypeEnum)
        .meta({ labels: { UNIFIED: "Unified", BILATERAL: "Bilateral" } })
        .default(defaultExerciseWeightType ?? WeightTypeEnum.UNIFIED),
    })
    .superRefine((val, ctx) => {
      if (
        val.weightType === WeightTypeEnum.BILATERAL &&
        val.additionalWeight == null
      ) {
        ctx.addIssue({
          path: ["additionalWeight"],
          code: "custom",
          message: "Value required",
          input: val.additionalWeight,
        });
      }
    });

export type ExerciseSetForm = z.infer<ReturnType<typeof getExerciseSetSchema>>;
