import { error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestEvent } from './$types';

const prisma = new PrismaClient();

export async function POST({ params }: RequestEvent) {
    const sessionId = params.sessionId;

    try {
        await prisma.workoutSession.update({
            where: {
                id: sessionId,
            },
            data: {
                finished: true,
            }
        });
    } catch (responseError) {
        error(400, (responseError as Error).message);
    }
}