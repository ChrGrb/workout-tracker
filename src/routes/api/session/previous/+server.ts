import { json, error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestEvent } from './$types';

const prisma = new PrismaClient();

export async function GET({ url }: RequestEvent) {
    if (!url.searchParams.get('userId')) {
        throw error(400, "No user id provided");
    }
    const userId = url.searchParams.get('userId') ?? "";

    const sessions = await prisma.workoutSession.findMany({ where: { userId: userId, finished: true }, orderBy: { createdAt: 'desc' }, });

    return json(sessions);
}
