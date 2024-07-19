import { json, error } from '@sveltejs/kit';
import { PrismaClient, type Exercise } from '@prisma/client';
import type { RequestEvent } from './$types';

const prisma = new PrismaClient();

export async function GET({ url }: RequestEvent) {
    const userId = url.searchParams.get('userId') ?? "";

    const exercises = await prisma.exercise.findMany({ where: { userId: userId }, include: { type: true } });

    return json(exercises);
}

export async function POST({ request }: RequestEvent) {
    const { exercise } = (await request.json()) as { exercise: Exercise };

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

        exercise.previousScore = previousExerciseOfType?.score ?? null;

        await prisma.workoutSession.update({
            where: {
                id: exercise.sessionId
            },
            data: { exercises: { create: exercise } }
        });
    } catch (responseError) {
        error(400, (responseError as Error).message);
    }
}