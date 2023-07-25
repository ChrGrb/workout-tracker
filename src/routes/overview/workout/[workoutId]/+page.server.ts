import { error } from '@sveltejs/kit'
import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';
import { Prisma, type WorkoutSession } from '@prisma/client';
import { redirect } from '@sveltejs/kit';

export async function load({ params, fetch }: PageServerLoadEvent) {
    if (!params.workoutId) {
        throw error(404, 'Workout not found');
    }

    const workoutWithSetsAndType = Prisma.validator<Prisma.WorkoutArgs>()({
        include: { sets: true, workoutType: true },
    });
    type WorkoutWithSetsAndType = Prisma.WorkoutGetPayload<typeof workoutWithSetsAndType>

    const responseWorkout = await fetch("/api/workout/" + params.workoutId);
    const workout = (await responseWorkout.json()) as WorkoutWithSetsAndType;

    const responseWorkoutActive = await fetch("/api/workout/" + params.workoutId + "/isActive");
    const { active } = (await responseWorkoutActive.json()) as { active: boolean };

    const responseWorkoutRecommendations = await fetch("/api/workout/" + params.workoutId + "/recommendations");
    const recommendations = (await responseWorkoutRecommendations.json()) as { recommendedWeight: number, recommendedReps: number } | null;

    return {
        workout: workout,
        workoutActive: active,
        recommendations: recommendations
    }
};


export const actions: Actions = {
    deleteSet: async ({ request, fetch }: RequestEvent) => {
        const form = await request.formData();
        const workoutId = form.get("workoutId");
        const setId = form.get("setId");

        try {
            await fetch(
                "/api/workout/" + workoutId + "/sets/" + setId,
                {
                    method: "DELETE",
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
        } catch (responseError) {
            throw error(400, 'Could not delete set with id: ' + setId);
        }
    },
    deleteCurrentWorkout: async ({ request, fetch }: RequestEvent) => {
        const form = await request.formData();
        const workoutId = form.get("workoutId");

        try {
            await fetch(
                "/api/workout/" + workoutId,
                {
                    method: "DELETE",
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
        } catch (responseError) {
            throw error(400, 'Could not delete workout with id: ' + workoutId);
        }

        throw redirect(300, '/overview');
    }
}