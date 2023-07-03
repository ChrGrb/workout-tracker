import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestEvent } from './$types';

const prisma = new PrismaClient();

export async function POST({ params }: RequestEvent) {
    const sessionId = Number(params.sessionId);

    const newWorkout = await prisma.session.update({
        where: {
            id: sessionId,
        },
        data: {
            finished: true,
        }
    });

    return json(newWorkout);
}