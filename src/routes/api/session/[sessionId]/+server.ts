import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient } from "@prisma/client";
import { json } from "@sveltejs/kit";

const prisma = new PrismaClient();

export async function POST({ request, params }: RequestEvent) {
    const sessionId = params.sessionId;
    const { workout } = await request.json();

    try {
        await prisma.workoutSession.update({
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

    return json(workout);
}