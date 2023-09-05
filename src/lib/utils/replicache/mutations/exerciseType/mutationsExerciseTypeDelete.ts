import type { ExerciseType, WorkoutSession } from "@prisma/client"
import type { WriteTransaction } from "replicache"

// Mutations
const mutationsExerciseTypeDelete = async ({ tx, args }: { tx: WriteTransaction, args: { exerciseType: ExerciseType, userId: string } }) => {
    const key = `user/${args.userId}/exerciseType/${args.exerciseType.id}`;

    return await tx.del(key);
}

export default mutationsExerciseTypeDelete