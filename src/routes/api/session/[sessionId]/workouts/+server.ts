import { json } from '@sveltejs/kit';
import { PrismaClient, Prisma } from '@prisma/client';
import type { RequestEvent } from './$types';

const prisma = new PrismaClient();

export async function GET({ url, params }: RequestEvent) {
    const sessionId = Number(params.sessionId);

    const sessions = await prisma.session.findFirst({ where: { id: sessionId }, include: { workouts: { include: { workoutType: true } } }, });

    return json(sessions);
}
