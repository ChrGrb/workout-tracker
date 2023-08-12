import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestEvent } from './$types';


const prisma = new PrismaClient();

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: RequestEvent) {
    const id = url.searchParams.get('id') ?? "";

    const user = await prisma.user.findUnique({ where: { id: id }, include: { settings: true } });

    return json(user);
}
