import { json, error } from '@sveltejs/kit';
import { PrismaClient, type Workout } from '@prisma/client';
import type { RequestEvent } from './$types';

const prisma = new PrismaClient();

export async function GET({ url }: RequestEvent) {
    const userId = Number(url.searchParams.get('userId') ?? 0);

    const workouts = await prisma.workout.findMany({ where: { userId: userId } });

    return json(workouts);
}

export async function POST({ request }: RequestEvent) {
    const { workout } = (await request.json()) as { workout: Workout };

    try {
        await prisma.session.update({
            where: {
                id: workout.sessionId
            },
            data: { workouts: { create: workout } }
        });
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }
}