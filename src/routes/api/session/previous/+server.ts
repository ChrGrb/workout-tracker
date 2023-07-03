import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestEvent } from './$types';

const prisma = new PrismaClient();

export async function GET({ url }: RequestEvent) {
    const userId = Number(url.searchParams.get('userId') ?? 0);

    const sessions = await prisma.session.findMany({ where: { userId: userId, finished: true }, orderBy: { createdAt: 'desc' }, });

    return json(sessions);
}
