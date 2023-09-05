import { getReplicacheAfterInit } from "$lib/stores/stores";
import generateId from "$lib/utils/generateId";
import type { ExerciseFull } from "$lib/utils/prismaTypes";
import type { ExerciseType } from "@prisma/client";

const deleteExerciseAction = async (exercise: ExerciseFull) => {
    getReplicacheAfterInit().mutate.deleteExercise({ ...exercise, isDeleted: true } as ExerciseFull);
};

export default deleteExerciseAction;