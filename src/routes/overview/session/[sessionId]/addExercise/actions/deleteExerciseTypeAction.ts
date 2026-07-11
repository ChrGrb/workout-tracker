import { zmutate } from "$lib/zero/outbox";
import type { ExerciseType } from "@prisma/client";

const deleteExerciseTypeAction = (
  userId: string,
  exerciseType: ExerciseType,
) => {
  zmutate.exerciseType.delete({ id: exerciseType.id, userId });
};

export default deleteExerciseTypeAction;
