import { error } from "@sveltejs/kit";
import type { RequestEvent } from "../$types";
import { PrismaClient, type ExerciseType } from '@prisma/client';
import { json } from "@sveltejs/kit";

const prisma = new PrismaClient();

export async function PUT({ params, request }: RequestEvent) {
    const exerciseTypeId = params.exerciseTypeId;
    const { exerciseTypeName } = (await request.json()) as { exerciseTypeName: string };

    let updatedExerciseType = null;

    try {
        updatedExerciseType = await prisma.exerciseType.update({
            where: { id: exerciseTypeId },
            data: {
                name: exerciseTypeName
            },
            select: {
                id: true,
            }
        });
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }

    return json(updatedExerciseType);
}