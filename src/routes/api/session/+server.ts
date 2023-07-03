import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestEvent } from './$types';

const prisma = new PrismaClient();

export async function GET({ url }: RequestEvent) {
    const userId = Number(url.searchParams.get('userId') ?? 0);

    const sessions = await prisma.session.findMany({ where: { userId: userId } });

    return json(sessions);
}

export async function POST({ request }: RequestEvent) {
    const { session } = await request.json();

    const newSession = await prisma.session.create({
        data: {
            ...session
        }
    });

    return json(newSession);
}