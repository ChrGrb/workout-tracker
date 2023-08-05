import { json, error } from '@sveltejs/kit';
import { PrismaClient, type ExerciseType } from '@prisma/client';
import type { RequestEvent } from './$types';
import { getExerciseDescription } from '$lib/utils/chatgpt/ExerciseDescription';

const prisma = new PrismaClient();

export async function GET({ params }: RequestEvent) {
    const userId = params.userId;

    if (!userId) {
        throw error(400, 'No user defined');
    }

    const exerciseTypes = await prisma.exerciseType.findMany({ where: { userId: userId } });

    return json(exerciseTypes);
}

export async function POST({ params, request }: RequestEvent) {
    const userId = params.userId;
    const { exerciseType } = (await request.json()) as { exerciseType: ExerciseType };

    exerciseType.description = await getExerciseDescription(exerciseType.name);

    try {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: { exerciseTypes: { create: exerciseType } }
        });
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }

    return json(exerciseType);
}