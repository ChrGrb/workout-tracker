import type { WorkoutSessionTemplateWithExerciseTypes } from "$lib/utils/prismaTypes";
import type { PrismaClient, WorkoutSessionTemplate } from "@prisma/client"

const utilsApiMutationsUserWorkoutSessionTemplateUpdate = async ({ args, tx, versionNext }: { args: Partial<WorkoutSessionTemplateWithExerciseTypes>, tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, versionNext: number }) => {
    console.log("Prisma user workout session template update started");
    const prismaData = {
        versionUpdatedAt: versionNext,
        id: args.id,
        userId: args.userId,
        name: args.name,
        createdAt: args.createdAt,
        isDeleted: args.isDeleted,
    } as WorkoutSessionTemplate

    try {
        await tx.workoutSessionTemplate.update({
            where: {
                id: args.id
            },
            data: {
                ...prismaData,
            }
        });

        if (args.exerciseTypes && args.exerciseTypes.length > 0)
            await tx.workoutSessionTemplate.update({
                where: {
                    id: args.id
                },
                data: {

                    exerciseTypes: {
                        connect: [...args.exerciseTypes.map(exerciseType => ({ "id": exerciseType.id }))]
                    }
                }
            })

        // Update workout session so Replicache knows it's contents have been updated
        await tx.user.update({
            where: {
                id: args.userId
            },
            data: {
                versionUpdatedAt: versionNext,
            }
        });
    } catch (err) {
        console.error((err as Error).message)
    }

    return
}

export default utilsApiMutationsUserWorkoutSessionTemplateUpdate;