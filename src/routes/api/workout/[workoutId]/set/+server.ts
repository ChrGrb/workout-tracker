import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient, type Workout, type WorkoutSet } from "@prisma/client";
import { json } from "@sveltejs/kit";
import type { WorkoutAverage } from "$lib/types/workoutAverage";

const prisma = new PrismaClient();

export async function POST({ request, params }: RequestEvent) {
    const workoutId = params.workoutId;
    const { workoutSet } = (await request.json()) as { workoutSet: WorkoutSet };

    const averages = await getAverages(workoutSet, workoutId);

    try {
        await prisma.workout.update({
            where: {
                id: workoutId
            },
            data: {
                sets: {
                    create: workoutSet,
                },
                averageReps: averages?.averageReps ?? 0,
                averageWeight: averages?.averageWeight ?? 0,
            }
        });
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }

    return json(workoutSet);
}

async function getAverages(newWorkoutSet: WorkoutSet, workoutId: string): Promise<WorkoutAverage | null> {
    const workout = await prisma.workout.findFirst({
        where: { id: workoutId }, include: {
            sets: true,
            workoutType: true,
        },
    });

    if (workout === null) {
        return null;
    }

    const sets = workout.sets.filter(set => !set.warmup);

    sets.push(newWorkoutSet);

    if (sets.length === 0) {
        null;
    }

    const weightSum = sets.reduce((sum, set) => sum + set.weight, 0);
    const weightAverage = Math.round((weightSum / sets.length) * 2) / 2;

    const repSum = sets.reduce((sum, set) => sum + set.reps, 0);
    const repAverage = Math.round(repSum / sets.length);

    const averages: WorkoutAverage = {
        averageWeight: weightAverage, averageReps: repAverage
    };

    return averages;
}