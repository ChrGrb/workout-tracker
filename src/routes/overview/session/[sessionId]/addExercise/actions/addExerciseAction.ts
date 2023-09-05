import { getReplicacheAfterInit } from "$lib/stores/stores";
import generateId from "$lib/utils/generateId";
import type { ExerciseFull } from "$lib/utils/prismaTypes";
import type { ExerciseType } from "@prisma/client";

const addExerciseAction = async (type: ExerciseType, userId: string, sessionId: string) => {
    getReplicacheAfterInit().mutate.createExercise({
        id: generateId(),
        versionUpdatedAt: null,
        userId: userId,
        type: type,
        typeId: type.id,
        previousScore: 0,
        averageWeight: null,
        averageReps: null,
        score: 0,
        sessionId: sessionId,
        createdAt: new Date(),
        isDeleted: false,
    } as ExerciseFull);
};

export default addExerciseAction;