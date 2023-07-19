import { json, error } from '@sveltejs/kit';
import { PrismaClient, type Workout } from '@prisma/client';
import type { RequestEvent } from './$types';

const prisma = new PrismaClient();

export async function GET({ url }: RequestEvent) {
    const userId = url.searchParams.get('userId') ?? "";

    const workouts = await prisma.workout.findMany({ where: { userId: userId }, include: { workoutType: true } });

    return json(workouts);
}

export async function POST({ request }: RequestEvent) {
    const { workout } = (await request.json()) as { workout: Workout };

    try {
        await prisma.workoutSession.update({
            where: {
                id: workout.sessionId
            },
            data: { workouts: { create: workout } }
        });
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }
}