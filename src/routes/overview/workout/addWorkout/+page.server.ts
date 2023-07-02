import { error } from '@sveltejs/kit'
import type { PageServerLoadEvent } from './$types';
import type { Prisma, Workout } from "@prisma/client";
import { redirect } from "@sveltejs/kit";
import { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request, cookies, fetch, params }: RequestEvent) => {
            const userId = Number(cookies.get('user_id'));
			const form = await request.formData();
			const workoutName = form.get('workoutName');

			const workout: Workout = {
                userId: userId,
                name: workoutName
            };

            console.log(workout);
    
            const response = await fetch(
                "/api/workout",
                {
                    method: "POST",
                    body: JSON.stringify({ workout: workout }),
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );

			throw redirect(303, '/overview');
    }
}