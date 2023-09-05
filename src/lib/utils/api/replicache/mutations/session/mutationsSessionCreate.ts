import type { PrismaClient, WorkoutSession } from "@prisma/client"

const utilsApiMutationsSessionCreate = async ({ args, userId, tx, versionNext }: { args: Omit<WorkoutSession, "type" | "exercises">, userId: string, tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, versionNext: number }) => {
    const prismaSessionFindUnique = await tx.workoutSession.findUnique({ where: { id: args.id } })

    console.log("Prisma session creation started");

    if (prismaSessionFindUnique) return

    const prismaData: WorkoutSession = {
        versionUpdatedAt: versionNext,
        id: args.id,
        name: args.name,
        userId: args.userId,
        finished: args.finished,
        createdAt: args.createdAt,
        isDeleted: false,
    }

    try {
        const id = await tx.workoutSession.create({
            data: {
                ...prismaData,
            },
            select: { id: true }
        });

        console.log("New Session ID: ", id);
    } catch (err) {
        console.error((err as Error).message)
    }

    return
}

export default utilsApiMutationsSessionCreate