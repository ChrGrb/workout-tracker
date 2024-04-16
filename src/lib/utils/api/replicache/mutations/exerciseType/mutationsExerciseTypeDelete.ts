import type { ExerciseType, PrismaClient } from "@prisma/client"

const utilsApiMutationsExerciseTypeDelete = async ({ args, tx, versionNext }: { args: { exerciseType: ExerciseType, userId: string }, tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, versionNext: number }) => {
    const prismaExerciseTypeFindUnique = await tx.exerciseType.findUnique({ where: { id: args.exerciseType.id } })

    if (!prismaExerciseTypeFindUnique) return

    try {
        await tx.user.update({
            where: {
                id: args.userId
            },
            data: {
                // --- SYSTEM ---
                versionUpdatedAt: versionNext,
                exerciseTypes: {
                    disconnect: { id: args.exerciseType.id }
                }
            }
        })
    } catch (err) {
        console.error((err as Error).message)
    }

    return
}

export default utilsApiMutationsExerciseTypeDelete