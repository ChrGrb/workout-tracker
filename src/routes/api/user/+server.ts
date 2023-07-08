import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestEvent } from './$types';


const prisma = new PrismaClient();

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: RequestEvent) {
    const email = url.searchParams.get('email') ?? "";

    const user = await prisma.user.findUnique({ where: { email: email } });

    return json(user);
}
