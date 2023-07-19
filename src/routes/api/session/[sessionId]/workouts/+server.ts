import { json } from '@sveltejs/kit';
import { PrismaClient, Prisma } from '@prisma/client';
import type { RequestEvent } from './$types';

const prisma = new PrismaClient();

export async function GET({ url, params }: RequestEvent) {
    const sessionId = params.sessionId;

    const sessions = await prisma.workoutSession.findFirst({ where: { id: sessionId }, include: { workouts: { include: { workoutType: true } } }, });

    return json(sessions);
}
