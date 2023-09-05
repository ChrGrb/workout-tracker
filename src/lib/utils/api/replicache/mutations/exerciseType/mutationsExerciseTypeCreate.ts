import type { ExerciseType, PrismaClient } from "@prisma/client"

const utilsApiMutationsExerciseTypeCreate = async ({ args, tx, versionNext }: { args: { exerciseType: ExerciseType, userId: string }, tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, versionNext: number }) => {
    const prismaExerciseTypeFindUnique = await tx.exerciseType.findUnique({ where: { id: args.exerciseType.id } })

    if (prismaExerciseTypeFindUnique) return

    console.log("Started creating exercise type");
    console.log("Args: ", args);

    const prismaData = {
        versionUpdatedAt: versionNext,
        id: args.exerciseType.id,
        name: args.exerciseType.name,
        description: args.exerciseType.description,
        isDeleted: false,
    } as ExerciseType

    try {
        await tx.user.update({
            where: {
                id: args.userId
            },
            data: {
                // --- SYSTEM ---
                versionUpdatedAt: versionNext,
                exerciseTypes: {
                    create: prismaData
                }
            }
        })
    } catch (err) {
        console.error((err as Error).message)
    }

    return
}

export default utilsApiMutationsExerciseTypeCreate