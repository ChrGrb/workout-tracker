import { getReplicacheAfterInit } from "$lib/stores/stores";
import type { ExerciseType } from "@prisma/client";

const deleteExerciseTypeAction = (
  userId: string,
  exerciseType: ExerciseType
) => {
  getReplicacheAfterInit().mutate.updateExerciseType({
    userId,
    exerciseType: { ...exerciseType, isDeleted: true },
  });
};

export default deleteExerciseTypeAction;
