import { error } from '@sveltejs/kit'
import type { PageServerLoadEvent } from './$types';
import { Prisma } from '@prisma/client';

export async function load({ params, fetch, depends }: PageServerLoadEvent) {
    if (!params.workoutId) {
        throw error(404, 'Workout not found');
    }

    depends(params.workoutId + ':sets');

    const workoutWithSetsAndType = Prisma.validator<Prisma.WorkoutArgs>()({
        include: { sets: true, workoutType: true },
    });

    type WorkoutWithSetsAndType = Prisma.WorkoutGetPayload<typeof workoutWithSetsAndType>

    const responseWorkout = await fetch("/api/workout/" + params.workoutId);
    const workout = (await responseWorkout.json()) as WorkoutWithSetsAndType;

    return {
        workout: workout,
    }
}