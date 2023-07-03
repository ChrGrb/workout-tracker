import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestEvent } from './$types';

const prisma = new PrismaClient();

export async function GET({ url }: RequestEvent) {
    const userId = Number(url.searchParams.get('userId') ?? 0);

    const workouts = await prisma.workout.findMany({ where: { userId: userId } });

    return json(workouts);
}

export async function POST({ request }) {
    const { workout } = await request.json();

    const newWorkout = await prisma.session.update({
        where: {
            id: workout.sessionId
        },
        data: { name: workout.name }
        
    });

    return json(newWorkout);
}