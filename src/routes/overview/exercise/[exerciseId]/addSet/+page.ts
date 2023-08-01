import { error } from "@sveltejs/kit";
import type { PageLoadEvent } from "./$types";
import type { Exercise } from "@prisma/client";

export async function load({ params, fetch }: PageLoadEvent) {
    if (!params.exerciseId) {
        throw error(404, 'Workout not found');
    }

    const responseExercise = await fetch("/api/exercise/" + params.exerciseId);
    const exercise = (await responseExercise.json()) as Exercise;

    return {
        exercise: exercise,
    }
}
