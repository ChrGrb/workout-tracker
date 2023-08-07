import { error } from "@sveltejs/kit";
import type { RequestEvent } from "../$types";
import { PrismaClient, type ExerciseType } from '@prisma/client';
import { json } from "@sveltejs/kit";
import { getExerciseDescription } from "$lib/utils/chatgpt/ExerciseDescription";

const prisma = new PrismaClient();

export async function PUT({ params, request }: RequestEvent) {
    const exerciseTypeId = params.exerciseTypeId;
    const userId = params.userId;
    const { exerciseTypeName } = (await request.json()) as { exerciseTypeName: string };

    let updatedExerciseType = null;

    try {
        updatedExerciseType = await prisma.exerciseType.update({
            where: { id: exerciseTypeId },
            data: {
                users: {
                    disconnect: [{ id: userId }]
                }
            },
            select: {
                id: true,
            }
        });

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                exerciseTypes: {
                    connectOrCreate: {
                        where: {
                            name: exerciseTypeName
                        },
                        create: {
                            name: exerciseTypeName,
                            description: await getExerciseDescription(exerciseTypeName)
                        }
                    }

                }
            }
        });
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }

    return json(updatedExerciseType);
}