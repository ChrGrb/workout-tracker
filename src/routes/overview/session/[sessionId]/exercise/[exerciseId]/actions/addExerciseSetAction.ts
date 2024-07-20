import { getReplicacheAfterInit } from "$lib/stores/stores";
import generateId from "$lib/utils/generateId";
import type { ExerciseFull } from "$lib/utils/prismaTypes";
import type { ExerciseSet } from "@prisma/client";

const addExerciseSetAction = async (
  exercise: ExerciseFull,
  exerciseSet: Partial<ExerciseSet>
) => {
  getReplicacheAfterInit().mutate.createExerciseSet({
    exercise: exercise,
    exerciseSet: {
      id: generateId(),
      exerciseSetType: exerciseSet.exerciseSetType,
      reps: exerciseSet.reps,
      weight: exerciseSet.weight,
      additionalWeight: exerciseSet.additionalWeight,
      time: exerciseSet.time,
      notes: exerciseSet.notes,
      createdAt: new Date(),
      isDeleted: false,
    } as ExerciseSet,
  });
};

export default addExerciseSetAction;
