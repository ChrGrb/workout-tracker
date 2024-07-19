import { json, error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestEvent } from './$types';

const prisma = new PrismaClient();

export async function GET({ url }: RequestEvent) {
    const userId = url.searchParams.get('userId') ?? "";

    const sessions = await prisma.workoutSession.findMany({ where: { userId: userId } });

    return json(sessions);
}

export async function POST({ request }: RequestEvent) {
    const { session } = await request.json();
    let createdSession = null;

    try {
        createdSession = await prisma.workoutSession.create({
            data: {
                ...session
            },
            select: {
                id: true,
            }
        });
    } catch (responseError) {
        error(400, (responseError as Error).message);
    }

    return json(createdSession);
}