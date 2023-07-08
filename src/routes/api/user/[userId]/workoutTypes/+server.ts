import { json, error } from '@sveltejs/kit';
import { PrismaClient, type Workout, type WorkoutType } from '@prisma/client';
import type { RequestEvent } from './$types';

const prisma = new PrismaClient();

export async function GET({ params }: RequestEvent) {
    const userId = Number(params.userId);

    if (!userId) {
        throw error(400, 'No user defined');
    }

    const workoutTypes = await prisma.workoutType.findMany({ where: { userId: userId } });

    return json(workoutTypes);
}

export async function POST({ params, request }: RequestEvent) {
    const userId = Number(params.userId);
    const { workoutType } = (await request.json()) as { workoutType: WorkoutType };

    try {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: { workoutTypes: { create: workoutType } }
        });
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }
}