import { error } from '@sveltejs/kit'
import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';
import type { Exercise, WorkoutSession, ExerciseType, User } from "@prisma/client";
import { redirect } from "@sveltejs/kit";


export async function load({ fetch, depends, locals }: PageServerLoadEvent) {
    const session = await locals.getSession();

    if (!session || !session.user) {
        throw error(400, 'User not defined');
    }

    const responseExerciseTypes = await fetch("/api/user/" + (session.user as User).id + "/exerciseTypes");
    const exerciseTypes = (await responseExerciseTypes.json()) as ExerciseType[];

    return {
        exerciseTypes: exerciseTypes,
        userId: (session.user as User).id
    }
}

export const actions: Actions = {
    addExercise: async ({ request, fetch, locals }: RequestEvent) => {
        const session = await locals.getSession();

        if (!session || !session.user) {
            throw error(400, 'User not defined');
        }

        const form = await request.formData();
        const exerciseTypeId = form.get('exercise-type-id');

        if (!exerciseTypeId) {
            throw error(400, 'Exercise type not defined');
        }

        const responseWorkoutSession = await fetch("/api/session/current?userId=" + (session.user as User).id);
        const workoutSession = (await responseWorkoutSession.json()) as WorkoutSession;

        const exercise: Exercise = {
            userId: (session.user as User).id,
            typeId: exerciseTypeId
        } as Exercise;

        let newExerciseId = null;

        try {
            const exerciseResponse = (await fetch(
                "/api/session/" + workoutSession.id + "/addExercise",
                {
                    method: "POST",
                    body: JSON.stringify({ exercise: exercise }),
                    headers: {
                        "content-type": "application/json",
                    },
                }
            ));
            newExerciseId = (await exerciseResponse.json()) as string;
        } catch (responseError) {
            throw error(400, 'Could not add exercise to session');
        }

        throw redirect(303, newExerciseId ? '/overview/exercise/' + newExerciseId : '/overview');
    },
    deleteExerciseType: async ({ request, fetch }: RequestEvent) => {
        const form = await request.formData();
        const exerciseTypeId = form.get("exerciseTypeId");
        const userId = form.get("userId");

        try {
            await fetch(
                "/api/user/" + userId + "/exerciseTypes/" + exerciseTypeId,
                {
                    method: "DELETE",
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
        } catch (responseError) {
            throw error(400, 'Could not delete exercise type with id: ' + exerciseTypeId);
        }
    },
    updateExerciseType: async ({ request, fetch }: RequestEvent) => {
        const form = await request.formData();
        const exerciseTypeId = form.get("exerciseTypeId");
        const exerciseTypeName = form.get("exerciseTypeName");
        const userId = form.get("userId");

        try {
            await fetch(
                "/api/user/" + userId + "/exerciseTypes/" + exerciseTypeId + "/updateName",
                {
                    method: "PUT",
                    body: JSON.stringify({ exerciseTypeName: exerciseTypeName }),
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
        } catch (responseError) {
            throw error(400, 'Could not update name of exercise type with id: ' + exerciseTypeId);
        }
    }
}