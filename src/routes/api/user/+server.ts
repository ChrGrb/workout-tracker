import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
    const userId = Number(url.searchParams.get('userId') ?? 0);

    const user = await prisma.user.findUnique({where: { id: userId }});

    return json(user);
}
