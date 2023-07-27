import { error } from "@sveltejs/kit";
import type { PageLoadEvent } from "./$types";
import type { Workout } from "@prisma/client";

export async function load({ params, fetch }: PageLoadEvent) {
    if (!params.workoutId) {
        throw error(404, 'Workout not found');
    }

    const responseWorkout = await fetch("/api/workout/" + params.workoutId);
    const workout = (await responseWorkout.json()) as Workout;

    return {
        workout: workout,
    }
}
