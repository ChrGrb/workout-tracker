import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { email } = await request.json();

    const newUser = await prisma.user.upsert({
        where: { email: email },
        update: { email: email },
        create: { email: email }
    });

    const user = await prisma.user.findUnique({where: { email: email }});

    return json(user);
}
