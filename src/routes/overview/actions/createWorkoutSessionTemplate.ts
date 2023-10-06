import { getReplicacheAfterInit } from "$lib/stores/stores";
import generateId from "$lib/utils/generateId";
import type { WorkoutSessionTemplateWithExerciseTypes } from "$lib/utils/prismaTypes";
import type { ExerciseType, WorkoutSession } from "@prisma/client";

const createWorkoutSessionTemplateAction = (userId: string, exerciseTypes: ExerciseType[], name: string) => {
    getReplicacheAfterInit().mutate.createUserWorkoutSessionTemplate({
        id: generateId(),
        versionUpdatedAt: null,
        name: name,
        userId: userId,
        exerciseTypes: exerciseTypes,
        createdAt: new Date(),
        isDeleted: false,
    } as WorkoutSessionTemplateWithExerciseTypes);
};

export default createWorkoutSessionTemplateAction;