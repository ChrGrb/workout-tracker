import type { PrismaClient } from "@prisma/client"

const utilsApiLastMutationIdSave = async ({ replicacheClientId, replicacheClientGroupId, userId, nextMutationId, lastModifiedVersion, tx }: { replicacheClientId: string, replicacheClientGroupId: string, userId: string, nextMutationId: number, lastModifiedVersion: number, tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"> }) => {
    console.log('Setting', replicacheClientId, 'replicacheClientId to', nextMutationId)

    // Check if client exists in db
    const checkClientGroupId = await tx.replicacheClient.findFirst({
        where: {
            id: replicacheClientId
        },
        select: {
            clientGroupId: true,
        }
    });

    if (checkClientGroupId?.clientGroupId) {
        // Update nextMutationId if the client exists in db
        await tx.replicacheClient.updateMany({
            where: { id: replicacheClientId },
            data: { lastMutationId: nextMutationId, lastModifiedVersion }
        });
    } else {
        // Create client if it does not yet exist
        await tx.replicacheClient.create({
            data: {
                id: replicacheClientId,
                userId,
                clientGroupId: replicacheClientGroupId,
                lastMutationId: nextMutationId,
                lastModifiedVersion
            }
        })
    }
}

export default utilsApiLastMutationIdSave