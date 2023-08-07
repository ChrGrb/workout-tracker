import { error } from '@sveltejs/kit'
import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';
import { Prisma } from '@prisma/client';
import { redirect } from '@sveltejs/kit';

export async function load({ params, fetch }: PageServerLoadEvent) {
    if (!params.exerciseId) {
        throw error(404, 'Workout not found');
    }

    const exerciseWithSetsAndType = Prisma.validator<Prisma.ExerciseDefaultArgs>()({
        include: { sets: true, type: true },
    });
    type ExerciseWithSetsAndType = Prisma.ExerciseGetPayload<typeof exerciseWithSetsAndType>

    const exercise = async () => {
        const responseExercise = await fetch("/api/exercise/" + params.exerciseId);
        return (await responseExercise.json()) as ExerciseWithSetsAndType;
    }

    const exerciseActive = async () => {
        const responseExerciseActive = await fetch("/api/exercise/" + params.exerciseId + "/isActive");
        return (await responseExerciseActive.json()) as { active: boolean };
    }

    const recommendations = async () => {
        const responseExerciseRecommendations = await fetch("/api/exercise/" + params.exerciseId + "/recommendations");
        return (await responseExerciseRecommendations.json()) as { recommendedWeight: number, recommendedReps: number } | null;
    }

    return {
        streamed: {
            exercise: exercise(),
            exerciseActive: exerciseActive(),
            recommendations: recommendations()
        }
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