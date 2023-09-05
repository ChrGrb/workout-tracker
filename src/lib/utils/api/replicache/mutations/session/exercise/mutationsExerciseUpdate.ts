import type { Exercise, PrismaClient } from "@prisma/client"

const utilsApiMutationsExerciseUpdate = async ({ args, userId, tx, versionNext }: { args: Exercise, userId: string, tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, versionNext: number }) => {
    const prismaData = {
        versionUpdatedAt: versionNext,
        id: args.id,
        userId: args.userId,
        score: args.score,
        typeId: args.typeId,
        createdAt: args.createdAt,
        isDeleted: args.isDeleted,
    } as Exercise

    try {
        await tx.exercise.update({
            where: {
                id: args.id
            },
            data: {
                ...prismaData,
            }
        });

        // Update workout session so Replicache knows it's contents have been updated
        await tx.workoutSession.update({
            where: {
                id: args.sessionId
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

export default utilsApiMutationsExerciseUpdate