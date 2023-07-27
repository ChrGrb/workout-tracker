import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient, type Workout } from "@prisma/client";
import { json } from "@sveltejs/kit";

const prisma = new PrismaClient();

export async function POST({ request, params }: RequestEvent) {
    const sessionId = params.sessionId;
    const { workout } = await request.json();

    let newWorkoutId;

    try {
        newWorkoutId = (await prisma.workoutSession.update({
            where: {
                id: sessionId
            },
            data: {
                workouts: {
                    create: workout,
                }
            },
            select: {
                workouts: {
                    select: {
                        id: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            },
        }) as { workouts: Workout[] }).workouts[0].id;
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }

    return json(newWorkoutId);
}