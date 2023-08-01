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
        },
    });

    const previousexerciseOfSameType = await prisma.exercise.findFirst({
        where: {
            typeId: exercise?.typeId,
            id: {
                not: exerciseId
            }
        },
        include: {
            sets: true
        },
    });

    if (!previousexerciseOfSameType) {
        return json(null);
    }

    const sets = previousexerciseOfSameType.sets.filter(set => set.exerciseSetType === 'WORKOUT');

    if (sets.length === 0) {
        return json(null);
    }

    const weightSum = sets.reduce((sum, set) => sum + set.weight, 0);
    const weightAverage = Math.round((weightSum / sets.length) * 2) / 2;

    const repSum = sets.reduce((sum, set) => sum + set.reps, 0);
    const repAverage = Math.round(repSum / sets.length);

    return json({ recommendedWeight: weightAverage, recommendedReps: repAverage });
}
