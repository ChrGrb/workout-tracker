import type { UserWithSettings, WorkoutSessionTemplateWithExerciseTypes } from "$lib/utils/prismaTypes";
import type { WriteTransaction } from "replicache"

// Mutations
const mutationsUserWorkoutSessionTemplatesCreate = async ({ tx, args }: { tx: WriteTransaction, args: WorkoutSessionTemplateWithExerciseTypes }) => {
    const key = `user/${args.userId}/user/workoutSessionTemplates/${args.id}`;

    if (await tx.has(key)) throw new Error('Workout session template already exists');

    return await tx.put(key, JSON.stringify({ ...args }));
}

export default mutationsUserWorkoutSessionTemplatesCreate;