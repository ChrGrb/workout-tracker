import { getReplicacheAfterInit } from "$lib/stores/stores";
import type { WorkoutSessionTemplateWithExerciseTypes } from "$lib/utils/prismaTypes";
import type { WorkoutSessionTemplate } from "@prisma/client";

const deleteWorkoutSessionTemplateAction = (workoutSessionTemplate: WorkoutSessionTemplate) => {
    getReplicacheAfterInit().mutate.updateUserWorkoutSessionTemplate({
        ...workoutSessionTemplate,
        isDeleted: true,
    } as WorkoutSessionTemplateWithExerciseTypes);
};

export default deleteWorkoutSessionTemplateAction;