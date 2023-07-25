import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient } from "@prisma/client";
import { error } from "@sveltejs/kit";

const prisma = new PrismaClient();

export async function GET({ params }: RequestEvent) {
    const workoutId = params.workoutId;

    const workout = await prisma.workout.findFirst({
        where: { id: workoutId }, include: {
            sets: true,
            workoutType: true,
        }
    });

    return json(workout);
}

export async function DELETE({ params }: RequestEvent) {
    const workoutId = params.workoutId;

    let deletedWorkout = null;

    try {
        deletedWorkout = await prisma.workout.delete({
            where: { id: workoutId },
            select: {
                id: true,
            }
        });
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }

    return json(deletedWorkout);
}