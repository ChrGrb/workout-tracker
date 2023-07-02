import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST({ request, params }: RequestEvent) {
    const workoutId = Number(params.workoutId);
    const { workoutSet } = await request.json();

    const newWorkout = await prisma.workout.update({
        where: {
            id: workoutId
        },
        data: {
            sets: {
                create: workoutSet,
            }
        }
    });

    return json(newWorkout);
}