import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';
import { error } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';

export async function load({ params, fetch }: PageServerLoadEvent) {
    if (!params.sessionId) {
        throw error(404, 'Session not found');
    }

    const sessionWithWorkoutsWithType = Prisma.validator<Prisma.WorkoutSessionArgs>()({
        include: { workouts: { include: { workoutType: true } } },
    });
    type SessionWithWorkoutsWithType = Prisma.WorkoutSessionGetPayload<typeof sessionWithWorkoutsWithType>

    const responseSession = await fetch("/api/session/" + params.sessionId + "/workouts");

    const workoutSession = (await responseSession.json()) as SessionWithWorkoutsWithType;

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