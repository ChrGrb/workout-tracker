import { error } from '@sveltejs/kit'
import type { Actions, RequestEvent } from './$types';
import type { WorkoutType } from "@prisma/client";
import { redirect } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ request, fetch, locals }: RequestEvent) => {
        const session = await locals.getSession();

        if (!session || !session.user) {
            throw error(400, 'User not defined');
        }

        const email = session.user.email;
        const form = await request.formData();
        const workoutTypeName = form.get('workoutTypeName');

        if (!workoutTypeName) {
            throw error(400, 'Workout type name not defined');
        }

        const workoutType: WorkoutType = {
            name: workoutTypeName
        } as WorkoutType;

        const userResponse = await fetch(
            "/api/user?email=" + email,
        );
        const user = await userResponse.json();

        try {
            await fetch(
                "/api/user/" + user.id + "/workoutTypes",
                {
                    method: "POST",
                    body: JSON.stringify({ workoutType: workoutType }),
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
        } catch (responseError) {
            throw error(400, 'Could not add workout to session');
        }

        throw redirect(303, '/overview/workout/addWorkout');
    }
}