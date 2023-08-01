import { error } from '@sveltejs/kit'
import type { Actions, RequestEvent } from './$types';
import type { ExerciseType, User } from "@prisma/client";
import { redirect } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ request, fetch, locals }: RequestEvent) => {
        const session = await locals.getSession();

        if (!session || !session.user) {
            throw error(400, 'User not defined');
        }

        const form = await request.formData();
        const exerciseTypeName = form.get('exerciseTypeName');

        if (!exerciseTypeName) {
            throw error(400, 'Exercise type name not defined');
        }

        const exerciseType: ExerciseType = {
            name: exerciseTypeName
        } as ExerciseType;

        try {
            await fetch(
                "/api/user/" + (session.user as User).id + "/exerciseTypes",
                {
                    method: "POST",
                    body: JSON.stringify({ exerciseType: exerciseType }),
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
        } catch (responseError) {
            throw error(400, 'Could not add exercise to session');
        }

        throw redirect(303, '/overview/exercise/addExercise');
    }
}