import { zmutate } from "$lib/zero/outbox";
import type { ExerciseFull } from "$lib/utils/prismaTypes";
import type { ExerciseSet } from "@prisma/client";

const deleteExerciseSetAction = async (
  _exercise: ExerciseFull,
  exerciseSet: ExerciseSet,
) => {
  zmutate.exerciseSet.delete({ id: exerciseSet.id });
};

export default deleteExerciseSetAction;
