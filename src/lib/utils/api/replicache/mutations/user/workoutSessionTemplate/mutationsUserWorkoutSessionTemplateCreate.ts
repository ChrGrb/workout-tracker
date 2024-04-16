import type { WorkoutSessionTemplateWithExerciseTypes } from "$lib/utils/prismaTypes";
import type { PrismaClient, Settings, WorkoutSessionTemplate } from "@prisma/client"

const utilsApiMutationsUserWorkoutSessionTemplateCreate = async ({ args, tx, versionNext }: { args: Partial<WorkoutSessionTemplateWithExerciseTypes>, tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, versionNext: number }) => {
    const prismaData = {
        versionUpdatedAt: versionNext,
        id: args.id,
        userId: args.userId,
        name: args.name,
        createdAt: args.createdAt,
        isDeleted: args.isDeleted,
    } as WorkoutSessionTemplate;

    try {
        await tx.workoutSessionTemplate.create({
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

export default utilsApiMutationsUserWorkoutSessionTemplateCreate;