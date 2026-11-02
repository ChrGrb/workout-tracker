import { z } from "zod";

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
const numberSchema = (min = 0, optional?: boolean) => {
  let schema = z.number().min(min).nullish();

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
      reps: numberSchema(1),
      weight: numberSchema(),
      additionalWeight: numberSchema(undefined, true),
      notes: z.string().default(""),
      exerciseSetType: z
        .enum(ExerciseSetTypeEnum)
        .default(ExerciseSetTypeEnum.WORKOUT),
      weightType: z
        .enum(WeightTypeEnum)
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
