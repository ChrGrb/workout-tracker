import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient, type Exercise, type ExerciseSet } from "@prisma/client";
import { json } from "@sveltejs/kit";
import type { ExerciseAverage } from "$lib/types/exerciseAverage";

const prisma = new PrismaClient();

export async function POST({ request, params }: RequestEvent) {
    const exerciseId = params.exerciseId;
    const { exerciseSet } = (await request.json()) as { exerciseSet: ExerciseSet };

    const averages = await getAverages(exerciseSet, exerciseId);

    let updatedExerciseId = "";

    try {
        updatedExerciseId = (await prisma.exercise.update({
            where: {
                id: exerciseId
            },
            data: {
                sets: {
                    create: exerciseSet,
                },
                averageReps: averages?.averageReps ?? 0,
                averageWeight: averages?.averageWeight ?? 0,
            },
            select: {
                id: true
            }
        })).id;
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }

    return json(updatedExerciseId);
}

async function getAverages(newexerciseSet: ExerciseSet, exerciseId: string): Promise<ExerciseAverage | null> {
    const exercise = await prisma.exercise.findFirst({
        where: { id: exerciseId }, include: {
            sets: true,
            type: true,
        },
    });

    if (exercise === null) {
        return null;
    }

    const sets = exercise.sets.filter(set => set.exerciseSetType === 'WORKOUT');

    sets.push(newexerciseSet);

    if (sets.length === 0) {
        null;
    }

    const weightSum = sets.reduce((sum, set) => sum + set.weight, 0);
    const weightAverage = Math.round((weightSum / sets.length) * 2) / 2;

    const repSum = sets.reduce((sum, set) => sum + set.reps, 0);
    const repAverage = Math.round(repSum / sets.length);

    const averages: ExerciseAverage = {
        averageWeight: weightAverage, averageReps: repAverage
    };

    return averages;
}