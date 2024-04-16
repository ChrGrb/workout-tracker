import type { PrismaClient, Settings } from "@prisma/client"

const utilsApiMutationsUserSettingsUpdate = async ({ args, tx, versionNext }: { args: Partial<Settings>, tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, versionNext: number }) => {
    try {
        const id = await tx.settings.update({
            where: {
                id: args.id,
            },
            data: {
                ...args,
                versionUpdatedAt: versionNext,
            },
            select: { id: true }
        });

    } catch (err) {
        console.error((err as Error).message);
    }

    return
}

export default utilsApiMutationsUserSettingsUpdate