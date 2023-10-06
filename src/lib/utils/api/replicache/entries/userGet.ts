import type { PrismaClient } from "@prisma/client"

const utilsApiEntriesUserGet = async ({ tx, userId, versionAt }: { tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, userId: string, versionAt: number }) => {
    const prismaUserFindFirst = await tx.user.findFirst({
        where: {
            AND: [{ versionUpdatedAt: { gt: versionAt ?? -1 } }, { id: userId }]
        },
        include: {
            settings: true,
            workoutSessionTemplates: {
                include: {
                    exerciseTypes: true
                }
            },
        }
    })

    return { data: prismaUserFindFirst }
}

export default utilsApiEntriesUserGet