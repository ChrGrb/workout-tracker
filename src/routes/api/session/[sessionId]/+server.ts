import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST({ request, params }: RequestEvent) {
    const sessionId = Number(params.sessionId);
    const { workout } = await request.json();

    const newWorkout = await prisma.session.update({
        where: {
            id: sessionId
        },
        data: {
            workouts: {
                create: workout,
            }
        }
    });

    return json(newWorkout);
}