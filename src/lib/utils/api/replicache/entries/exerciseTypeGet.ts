import type { PrismaClient } from "@prisma/client"

const utilsApiEntriesExerciseTypeGet = async ({ tx, userId, versionAt }: { tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, userId: string, versionAt: number }) => {
    const prismaExerciseTypeFindFirst = (await tx.user.findFirst({
        where: {
            id: userId,
        },
        select: {
            exerciseTypes: {
                where: {
                    versionUpdatedAt: { gt: versionAt ?? -1 }
                }
            }
        }
    }));

    return { data: prismaExerciseTypeFindFirst?.exerciseTypes }
}

export default utilsApiEntriesExerciseTypeGet