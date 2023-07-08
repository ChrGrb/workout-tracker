import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST({ request, params }: RequestEvent) {
    const sessionId = Number(params.sessionId);
    const { workout } = await request.json();

    try {
        await prisma.session.update({
            where: {
                id: sessionId
            },
            data: {
                workouts: {
                    create: workout,
                }
            }
        });
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }
}