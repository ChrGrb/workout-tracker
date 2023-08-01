import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';
import { error } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';

export async function load({ params, fetch }: PageServerLoadEvent) {
    if (!params.sessionId) {
        throw error(404, 'Session not found');
    }

    const workoutSessionWithExercisesWithType = Prisma.validator<Prisma.WorkoutSessionArgs>()({
        include: { exercises: { include: { type: true } } }
    },);

    type WorkoutSessionWithExercisesWithType = Prisma.WorkoutSessionGetPayload<typeof workoutSessionWithExercisesWithType>

    const responseSession = await fetch("/api/session/" + params.sessionId + "/exercises");

    const workoutSession = (await responseSession.json()) as WorkoutSessionWithExercisesWithType;

    return {
        session: workoutSession,
    }
}

export const actions: Actions = {
    deleteCurrentSession: async ({ request, fetch }: RequestEvent) => {
        const form = await request.formData();
        const sessionId = form.get("sessionId");

        try {
            await fetch(
                "/api/session/" + sessionId,
                {
                    method: "DELETE",
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
        } catch (responseError) {
            throw error(400, 'Could not finish current session');
        }

        throw redirect(300, '/overview');
    }
}