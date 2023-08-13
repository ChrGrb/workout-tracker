import { error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestEvent } from './$types';

const prisma = new PrismaClient();

export async function PUT({ params, request }: RequestEvent) {
    const sessionId = params.sessionId;
    const { newSessionName } = (await request.json()) as { newSessionName: string };

    console.log("Session name: ", newSessionName);

    try {
        await prisma.workoutSession.update({
            where: {
                id: sessionId,
            },
            data: {
                name: newSessionName
            }
        });
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }
}