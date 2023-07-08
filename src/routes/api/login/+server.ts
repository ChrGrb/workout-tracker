import { json, error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestEvent } from './$types';

const prisma = new PrismaClient();

export async function POST({ request }: RequestEvent) {
    const { email } = await request.json();

    try {
        await prisma.user.upsert({
            where: { email: email },
            update: { email: email },
            create: { email: email }
        });

    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }
    const user = await prisma.user.findUnique({ where: { email: email } });

    return json(user);
}
