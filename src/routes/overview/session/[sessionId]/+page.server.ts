import { error } from '@sveltejs/kit'
import type { PageServerLoadEvent } from './$types';
import { Prisma, Workout } from '@prisma/client';

export async function load({ params, fetch, depends }: PageServerLoadEvent) {
    if (!params.sessionId) {
        throw error(404, 'Session not found');
    }

    const sessionWithWorkouts = Prisma.validator<Prisma.SessionArgs>()({
        include: { workouts: true },
    });

    type SessionWithWorkouts = Prisma.SessionGetPayload<typeof sessionWithWorkouts>

    const responseSession = await fetch("/api/session/" + params.sessionId + "/workouts");
    const workoutSession = (await responseSession.json()) as WorkoutWithSets;

    return {
        session: workoutSession,
    }
}