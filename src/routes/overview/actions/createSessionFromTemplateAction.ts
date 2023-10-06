import { getReplicacheAfterInit } from "$lib/stores/stores";
import generateId from "$lib/utils/generateId";
import type { WorkoutSessionTemplateWithExerciseTypes } from "$lib/utils/prismaTypes";
import type { WorkoutSession } from "@prisma/client";
import addExerciseAction from "../session/[sessionId]/addExercise/actions/addExerciseAction";

const createSessionFromTemplateAction = (userId: string, template: WorkoutSessionTemplateWithExerciseTypes) => {
    const sessionId = generateId();

    getReplicacheAfterInit().mutate.createSession({
        id: sessionId,
        versionUpdatedAt: null,
        name: template.name,
        userId: userId,
        exercises: [],
        finished: false,
        createdAt: new Date(),
        isDeleted: false,
    } as WorkoutSession);

    template.exerciseTypes.forEach((exerciseType) => addExerciseAction(exerciseType, userId, sessionId));
};

export default createSessionFromTemplateAction;