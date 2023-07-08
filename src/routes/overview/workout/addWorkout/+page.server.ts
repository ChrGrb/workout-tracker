import { error } from '@sveltejs/kit'
import type { Actions, RequestEvent } from './$types';
import type { Session, Workout } from "@prisma/client";
import { redirect } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ request, fetch, locals }: RequestEvent) => {
        const session = await locals.getSession();

        if (!session || !session.user) {
            throw error(400, 'User not defined');
        }

        const email = session.user.email;
        const form = await request.formData();
        const workoutName = form.get('workoutName');

        if (!workoutName) {
            throw error(400, 'Workout name not defined');
        }

        const userResponse = await fetch(
            "/api/user?email=" + email,
        );
        const user = await userResponse.json();


        const responseSession = await fetch("/api/session/current?userId=" + user.id);
        const workoutSession = (await responseSession.json()) as Session;

        const workout: Workout = {
            userId: user.id,
            name: workoutName?.toString()
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