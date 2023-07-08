import { json, error } from '@sveltejs/kit';
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

    try {
        await prisma.session.create({
            data: {
                ...session
            }
        });
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }
}