import { error } from '@sveltejs/kit'
import type { PageServerLoadEvent } from './$types';
import { Prisma, Workout } from '@prisma/client';

export async function load({ params, fetch, depends }: PageServerLoadEvent) {
    if (!params.workoutId) {
        throw error(404, 'Workout not found');
    }

    depends(params.workoutId + ':sets');

    const workoutWithSets = Prisma.validator<Prisma.WorkoutArgs>()({
        include: {sets: true},
    });

    type WorkoutWithSets = Prisma.WorkoutGetPayload<typeof workoutWithSets>

    const responseWorkout = await fetch("/api/workout/" + params.workoutId);
    const workout = (await responseWorkout.json()) as WorkoutWithSets;

    return {
        workout: workout,
    }
}