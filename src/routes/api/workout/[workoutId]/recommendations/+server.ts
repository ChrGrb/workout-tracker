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
        },
    });

    const previousWorkoutOfSameType = await prisma.workout.findFirst({
        where: {
            workoutTypeId: workout?.workoutTypeId,
            id: {
                not: workoutId
            }
        },
        include: {
            sets: true
        },
    });

    if (!previousWorkoutOfSameType) {
        return json(null);
    }

    const sets = previousWorkoutOfSameType.sets.filter(set => !set.warmup);

    if (sets.length === 0) {
        return json(null);
    }

    const weightSum = sets.reduce((sum, set) => sum + set.weight, 0);
    const weightAverage = Math.round((weightSum / sets.length) * 2) / 2;

    const repSum = sets.reduce((sum, set) => sum + set.reps, 0);
    const repAverage = Math.round(repSum / sets.length);

    return json({ recommendedWeight: weightAverage, recommendedReps: repAverage });
}
