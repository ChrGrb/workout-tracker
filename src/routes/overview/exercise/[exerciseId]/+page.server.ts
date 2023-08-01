import { error } from '@sveltejs/kit'
import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';
import { Prisma, type WorkoutSession } from '@prisma/client';
import { redirect } from '@sveltejs/kit';

export async function load({ params, fetch }: PageServerLoadEvent) {
    if (!params.exerciseId) {
        throw error(404, 'Workout not found');
    }

    const exerciseWithSetsAndType = Prisma.validator<Prisma.ExerciseArgs>()({
        include: { sets: true, type: true },
    });
    type ExerciseWithSetsAndType = Prisma.ExerciseGetPayload<typeof exerciseWithSetsAndType>

    const responseExercise = await fetch("/api/exercise/" + params.exerciseId);
    const exercise = (await responseExercise.json()) as ExerciseWithSetsAndType;

    const responseExerciseActive = await fetch("/api/exercise/" + params.exerciseId + "/isActive");
    const { active } = (await responseExerciseActive.json()) as { active: boolean };

    const responseExerciseRecommendations = await fetch("/api/exercise/" + params.exerciseId + "/recommendations");
    const recommendations = (await responseExerciseRecommendations.json()) as { recommendedWeight: number, recommendedReps: number } | null;

    return {
        exercise: exercise,
        exerciseActive: active,
        recommendations: recommendations
    }
};


export const actions: Actions = {
    deleteSet: async ({ request, fetch }: RequestEvent) => {
        const form = await request.formData();
        const exerciseId = form.get("exerciseId");
        const setId = form.get("setId");

        try {
            await fetch(
                "/api/exercise/" + exerciseId + "/sets/" + setId,
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
    deleteCurrentExercise: async ({ request, fetch }: RequestEvent) => {
        const form = await request.formData();
        const exerciseId = form.get("exerciseId");

        try {
            await fetch(
                "/api/exercise/" + exerciseId,
                {
                    method: "DELETE",
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
        } catch (responseError) {
            throw error(400, 'Could not delete exercise with id: ' + exerciseId);
        }

        throw redirect(300, '/overview');
    }
}