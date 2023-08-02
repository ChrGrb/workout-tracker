import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient } from "@prisma/client";
import { error } from "@sveltejs/kit";

const prisma = new PrismaClient();

export async function GET({ params }: RequestEvent) {
    const exerciseTypeId = params.exerciseTypeId;

    const exerciseType = await prisma.exerciseType.findFirst({
        where: { id: exerciseTypeId }
    });

    return json(exerciseType);
}

export async function DELETE({ params }: RequestEvent) {
    const exerciseTypeId = params.exerciseTypeId;

    let deletedexerciseType = null;

    try {
        deletedexerciseType = await prisma.exerciseType.delete({
            where: { id: exerciseTypeId },
            select: {
                id: true,
            }
        });
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }

    return json(deletedexerciseType);
}