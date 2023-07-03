import { error } from '@sveltejs/kit'
import type { PageServerLoadEvent } from './$types';
import type { Prisma, Workout } from "@prisma/client";
import { redirect } from "@sveltejs/kit";
import { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request, fetch, params, locals }: RequestEvent) => {
        const session = await locals.getSession();

        if(session) {
            const email = session.user.email;
			const form = await request.formData();
			const workoutName = form.get('workoutName');

            const userResponse = await fetch(
                "/api/user?email=" + email,
            );
            const user = await userResponse.json();

            
        const responseSession = await fetch("/api/session/current?userId=" + user.id);
        const workoutSession = (await responseSession.json()) as Session;

			const workout: Workout = {
                userId: user.id,
                name: workoutName
            };
    
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

			throw redirect(303, '/overview');
        }
    }
}