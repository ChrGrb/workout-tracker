import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestEvent } from './$types';

const prisma = new PrismaClient();

export async function GET({ url }: RequestEvent) {
    const userId = url.searchParams.get('userId') ?? "";

    const sessions = await prisma.workoutSession.findFirst({ where: { userId: userId, finished: false }, orderBy: { createdAt: 'desc' }, });

    return json(sessions);
}
