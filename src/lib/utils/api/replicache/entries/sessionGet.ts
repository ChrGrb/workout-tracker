import type { PrismaClient } from "@prisma/client"

const utilsApiEntriesSessionGet = async ({ tx, userId, versionAt }: { tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, userId: string, versionAt: number }) => {
    const prismaExerciseFindMany = await tx.workoutSession.findMany({
        where: {
            AND: [{ versionUpdatedAt: { gt: versionAt ?? -1 } }, { userId }]
        },
        include: {
            exercises: {
                include: {
                    type: true,
                    sets: true,
                }
            }
        }
    })

    return { data: prismaExerciseFindMany }
}

export default utilsApiEntriesSessionGet