import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient } from "@prisma/client";
import { error } from "@sveltejs/kit";

const prisma = new PrismaClient();

export async function GET({ params }: RequestEvent) {
    const workoutTypeId = params.workoutTypeId;

    const workoutType = await prisma.workoutType.findFirst({
        where: { id: workoutTypeId }
    });

    return json(workoutType);
}

export async function DELETE({ params }: RequestEvent) {
    const workoutTypeId = params.workoutTypeId;

    let deletedWorkoutType = null;

    try {
        deletedWorkoutType = await prisma.workoutType.delete({
            where: { id: workoutTypeId },
            select: {
                id: true,
            }
        });
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }

    return json(deletedWorkoutType);
}