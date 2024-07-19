import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient, type Exercise } from "@prisma/client";
import { json } from "@sveltejs/kit";

const prisma = new PrismaClient();

export async function POST({ request, params }: RequestEvent) {
    const sessionId = params.sessionId;
    const { exercise } = await request.json();

    let newExerciseId;

    try {
        const previousExerciseOfType = await prisma.exercise.findFirst({
            where: {
                typeId: exercise.typeId
            },
            select: {
                score: true,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        exercise.score = 0;
        exercise.previousScore = previousExerciseOfType?.score ?? null;

        newExerciseId = (await prisma.workoutSession.update({
            where: {
                id: sessionId
            },
            data: {
                exercises: {
                    create: exercise,
                }
            },
            select: {
                exercises: {
                    select: {
                        id: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            },
        }) as { exercises: Exercise[] }).exercises[0].id;
    } catch (responseError) {
        error(400, (responseError as Error).message);
    }

    return json(newExerciseId);
}