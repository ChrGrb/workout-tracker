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
        await prisma.workoutSession.update({
            where: {
                id: exercise.sessionId
            },
            data: { exercises: { create: exercise } }
        });
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }
}