import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient } from "@prisma/client";
import { error } from "@sveltejs/kit";

const prisma = new PrismaClient();

export async function GET({ params }: RequestEvent) {
    const exerciseId = params.exerciseId;

    const exercise = await prisma.exercise.findFirst({
        where: { id: exerciseId }, include: {
            sets: true,
            type: true,
        }
    });

    return json(exercise);
}

export async function DELETE({ params }: RequestEvent) {
    const exerciseId = params.exerciseId;

    let deletedExercise = null;

    try {
        deletedExercise = await prisma.exercise.delete({
            where: { id: exerciseId },
            select: {
                id: true,
            }
        });
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }

    return json(deletedExercise);
}