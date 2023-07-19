import { error } from '@sveltejs/kit'
import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';
import type { Workout, WorkoutSession, WorkoutType } from "@prisma/client";
import { redirect } from "@sveltejs/kit";


export async function load({ fetch, depends, locals }: PageServerLoadEvent) {
    const session = await locals.getSession();

    if (!session || !session.user) {
        throw error(400, 'User not defined');
    }

    depends('app:workoutTypes');
    const responseWorkoutTypes = await fetch("/api/user/" + session.user.id + "/workoutTypes");
    const workoutTypes = (await responseWorkoutTypes.json()) as WorkoutType[];

    return {
        workoutTypes: workoutTypes,
    }
}

export const actions: Actions = {
    default: async ({ request, fetch, locals }: RequestEvent) => {
        const session = await locals.getSession();

        if (!session || !session.user) {
            throw error(400, 'User not defined');
        }

        const form = await request.formData();
        const workoutTypeId = form.get('workout-type-id');

        if (!workoutTypeId) {
            throw error(400, 'Workout type not defined');
        }

        const responseWorkoutSession = await fetch("/api/session/current?userId=" + session.user.id);
        const workoutSession = (await responseWorkoutSession.json()) as WorkoutSession;

        const workout: Workout = {
            userId: session.user.id,
            workoutTypeId: workoutTypeId
        } as Workout;

        try {
            await fetch(
                "/api/session/" + workoutSession.id,
                {
                    method: "POST",
                    body: JSON.stringify({ workout: workout }),
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
        } catch (responseError) {
            throw error(400, 'Could not add workout to session');
        }

        throw redirect(303, '/overview');
    }
}