import { zmutate } from "$lib/zero/outbox";
import type { ExerciseFull } from "$lib/utils/prismaTypes";

const deleteExerciseAction = async (exercise: ExerciseFull) => {
  zmutate.exercise.delete({ id: exercise.id });
};

export default deleteExerciseAction;
