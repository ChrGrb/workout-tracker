import type { PrismaClient } from "@prisma/client"

const utilsApiLastMutationIdGet = async ({ userId, cookie, tx }: { userId: string, cookie: number, tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"> }) => {
    let lastMutationIdChanges = {};

    const prismaReplicacheFindMany = await tx.replicacheClient.findMany({
        where: { AND: [{ userId }, { lastModifiedVersion: { gt: cookie } }] },
        select: { id: true, lastMutationId: true }
    })

    if (prismaReplicacheFindMany) lastMutationIdChanges = Object.fromEntries(prismaReplicacheFindMany.map(replicacheClient => [replicacheClient.id, replicacheClient.lastMutationId]));


    return { data: lastMutationIdChanges }
}

export default utilsApiLastMutationIdGet