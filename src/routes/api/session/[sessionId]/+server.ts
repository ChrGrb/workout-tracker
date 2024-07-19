import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestEvent } from './$types';
import { error } from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function GET({ params }: RequestEvent) {
    const sessionId = params.sessionId;

    const sessions = await prisma.workoutSession.findFirst({ where: { id: sessionId }, });

    return json(sessions);
}

export async function DELETE({ params }: RequestEvent) {
    const sessionId = params.sessionId;
    let deletedSession = null;

    try {
        deletedSession = await prisma.workoutSession.delete({
            where: { id: sessionId },
            select: {
                id: true,
            }
        });
    } catch (responseError) {
        error(400, (responseError as Error).message);
    }

    return json(deletedSession);
}
