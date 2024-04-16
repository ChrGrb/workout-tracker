import type { PrismaClient } from "@prisma/client"

const utilsApiVersionSave = async ({ tx, userId, versionAt }: { tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, userId: string, versionAt: number }) => {
    try {
        const prismaSpaceUpdate = await tx.replicacheSpace.update({
            where: { userId },
            data: { versionAt },
            select: { versionAt: true }
        })

        return { data: prismaSpaceUpdate }
    } catch (err) {
        console.error(err)
    }

    return { data: undefined }
}

export default utilsApiVersionSave