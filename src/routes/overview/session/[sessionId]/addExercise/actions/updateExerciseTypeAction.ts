import { getReplicacheAfterInit } from "$lib/stores/stores";
import type { ExerciseType } from "@prisma/client";

const updateExerciseTypeAction = (
  exerciseType: Partial<ExerciseType>,
  userId: string
) => {
  getReplicacheAfterInit().mutate.updateExerciseType({
    exerciseType,
    userId,
  });
};

export default updateExerciseTypeAction;
