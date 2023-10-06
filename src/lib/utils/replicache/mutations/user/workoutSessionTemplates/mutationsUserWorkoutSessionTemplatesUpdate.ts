import type { UserWithSettings, WorkoutSessionTemplateWithExerciseTypes } from "$lib/utils/prismaTypes";
import type { WriteTransaction } from "replicache"

// Mutations
const mutationsUserWorkoutSessionTemplatesUpdate = async ({ tx, args }: { tx: WriteTransaction, args: Partial<WorkoutSessionTemplateWithExerciseTypes> }) => {
    const key = `user/${args.userId}/user/workoutSessionTemplates/${args.id}`;

    var workoutSessionTemplate = JSON.parse((await tx.get(key) ?? '').toString()) as WorkoutSessionTemplateWithExerciseTypes;
    workoutSessionTemplate = { ...workoutSessionTemplate, ...args };

    return await tx.put(key, JSON.stringify({ ...workoutSessionTemplate }));
}

export default mutationsUserWorkoutSessionTemplatesUpdate;