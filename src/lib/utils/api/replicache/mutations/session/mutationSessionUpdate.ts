import type { PrismaClient, WorkoutSession } from "@prisma/client"

const utilsApiMutationsSessionUpdate = async ({ args, tx, versionNext }: { args: Omit<WorkoutSession, "user" | "exercises" | "versionUpdatedAt">, tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, versionNext: number }) => {

    const prismaData: WorkoutSession = {
        versionUpdatedAt: versionNext,
        id: args.id,
        name: args.name,
        userId: args.userId,
        finished: args.finished,
        createdAt: args.createdAt,
        isDeleted: args.isDeleted
    };

    try {
        const id = await tx.workoutSession.update({
            where: {
                id: args.id,
            },
            data: {
                ...prismaData,
            },
            select: { id: true }
        });

    } catch (err) {
        console.error((err as Error).message);
    }

    return
}

export default utilsApiMutationsSessionUpdate