import { error } from '@sveltejs/kit'
import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';
import type { Session, User, Workout, WorkoutType } from "@prisma/client";
import { redirect } from "@sveltejs/kit";


export async function load({ params, fetch, depends, locals }: PageServerLoadEvent) {
    const session = await locals.getSession();

    if (!session || !session.user) {
        throw error(400, 'User not defined');
    }

    depends('app:user');
    const responseUser = await fetch("/api/user?email=" + session.user.email);
    const user = (await responseUser.json()) as User;


    depends('app:workoutTypes');
    const responseWorkoutTypes = await fetch("/api/user/" + user.id + "/workoutTypes");
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

        const email = session.user.email;
        const form = await request.formData();
        const workoutTypeId = Number(form.get('workout-type-id'));

        if (!workoutTypeId) {
            throw error(400, 'Workout type not defined');
        }

        const userResponse = await fetch(
            "/api/user?email=" + email,
        );
        const user = await userResponse.json();


        const responseSession = await fetch("/api/session/current?userId=" + user.id);
        const workoutSession = (await responseSession.json()) as Session;

        const workout: Workout = {
            userId: user.id,
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