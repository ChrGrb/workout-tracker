import prisma from "$lib/db.server";
import type { ExerciseAverage } from "$lib/types/exerciseAverage";
import type { Exercise, ExerciseSet, PrismaClient } from "@prisma/client"

const utilsApiMutationsExerciseSetUpdate = async ({ args, tx, versionNext }: { args: { exercise: Exercise, exerciseSet: ExerciseSet }, tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, versionNext: number }) => {
    const prismaData = {
        versionUpdatedAt: versionNext,
        id: args.exerciseSet.id,
        exerciseId: args.exerciseSet.exerciseId,
        exerciseSetType: args.exerciseSet.exerciseSetType,
        reps: args.exerciseSet.reps,
        weight: args.exerciseSet.weight,
        createdAt: args.exerciseSet.createdAt,
        notes: args.exerciseSet.notes,
        isDeleted: args.exerciseSet.isDeleted,
    } as ExerciseSet

    try {
        await tx.exerciseSet.update({
            where: {
                id: args.exerciseSet.id
            },
            data: {
                ...prismaData
            },
        });

        // Update workout session so Replicache knows it's contents have been updated
        await tx.workoutSession.update({
            where: {
                id: args.exercise.sessionId
            },
            data: {
                versionUpdatedAt: versionNext,
            }
        });
    } catch (err) {
        console.error((err as Error).message)
    }

    return
}

export default utilsApiMutationsExerciseSetUpdate