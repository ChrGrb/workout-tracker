import { zmutate } from "$lib/zero/outbox";
import generateId from "$lib/utils/generateId";
import type { ExerciseFull } from "$lib/utils/prismaTypes";
import type { ExerciseSet } from "@prisma/client";
import type { ExerciseSetType } from "$lib/zero/schema";

const addExerciseSetAction = async (
  exercise: ExerciseFull,
  exerciseSet: Partial<ExerciseSet>,
) => {
  await zmutate.exerciseSet.create({
    id: generateId(),
    exerciseId: exercise.id,
    exerciseSetType: (exerciseSet.exerciseSetType ?? "WORKOUT") as ExerciseSetType,
    reps: exerciseSet.reps ?? 1,
    weight: exerciseSet.weight ?? 0,
    additionalWeight: exerciseSet.additionalWeight ?? 0,
    time: exerciseSet.time ?? 0,
    notes: exerciseSet.notes ?? "",
    createdAt: Date.now(),
  });
};

export default addExerciseSetAction;
