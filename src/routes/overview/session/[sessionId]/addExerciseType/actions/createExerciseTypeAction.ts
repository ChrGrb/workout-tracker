import { getReplicacheAfterInit } from "$lib/stores/stores";
import generateId from "$lib/utils/generateId";
import type { ExerciseType } from "@prisma/client";

const createExerciseTypeAction = (userId: string, exerciseTypeName: string) => {
    getReplicacheAfterInit().mutate.createExerciseType({
        userId,
        exerciseType: {
            id: generateId(),
            versionUpdatedAt: null,
            name: exerciseTypeName,
            description: "",
            isDeleted: false,
        } as ExerciseType
    });
};

export default createExerciseTypeAction;