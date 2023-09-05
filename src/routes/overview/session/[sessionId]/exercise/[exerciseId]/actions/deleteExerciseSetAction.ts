import { getReplicacheAfterInit } from "$lib/stores/stores";
import generateId from "$lib/utils/generateId";
import type { ExerciseFull } from "$lib/utils/prismaTypes";
import type { ExerciseSet } from "@prisma/client";

const deleteExerciseSetAction = async (exercise: ExerciseFull, exerciseSet: ExerciseSet) => {
    getReplicacheAfterInit().mutate.deleteExerciseSet({
        exercise,
        exerciseSet: { ...exerciseSet, isDeleted: true }
    });
}

export default deleteExerciseSetAction;