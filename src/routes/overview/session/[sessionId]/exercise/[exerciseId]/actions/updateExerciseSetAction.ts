import { zmutate } from "$lib/zero/outbox";
import type { ExerciseSet } from "@prisma/client";
import type { UpdateExerciseSetArgs } from "$lib/zero/mutators";
import type { ExerciseSetType } from "$lib/zero/schema";

export type ExerciseSetFormValues = {
  exerciseSetType: ExerciseSetType;
  reps: number;
  weight: number;
  additionalWeight: number | null | undefined;
  notes: string;
  weightType: "UNIFIED" | "BILATERAL";
};

// Sends only the fields that differ from the stored set, so a stale offline
// edit replayed later can't overwrite newer values of untouched fields.
const updateExerciseSetAction = async (
  exerciseSet: ExerciseSet,
  values: ExerciseSetFormValues,
) => {
  const next = {
    exerciseSetType: values.exerciseSetType,
    reps: values.reps,
    weight: values.weight,
    additionalWeight:
      values.weightType === "BILATERAL" ? (values.additionalWeight ?? 0) : 0,
    notes: values.notes.trim(),
  };

  const changed: Omit<UpdateExerciseSetArgs, "id"> = {};
  for (const key of Object.keys(next) as (keyof typeof next)[]) {
    if (next[key] !== exerciseSet[key]) {
      Object.assign(changed, { [key]: next[key] });
    }
  }

  if (Object.keys(changed).length === 0) return;
  await zmutate.exerciseSet.update({ id: exerciseSet.id, ...changed });
};

export default updateExerciseSetAction;
