import { error } from '@sveltejs/kit'
import type { PageServerLoadEvent } from './$types';
import { Prisma } from '@prisma/client';

export async function load({ params, fetch, depends }: PageServerLoadEvent) {
    if (!params.sessionId) {
        throw error(404, 'Session not found');
    }

    const sessionWithWorkoutsWithType = Prisma.validator<Prisma.SessionArgs>()({
        include: { workouts: { include: { workoutType: true } } },
    });

    type SessionWithWorkoutsWithType = Prisma.SessionGetPayload<typeof sessionWithWorkoutsWithType>

    const responseSession = await fetch("/api/session/" + params.sessionId + "/workouts");

    const workoutSession = (await responseSession.json()) as SessionWithWorkoutsWithType;

    return {
        session: workoutSession,
    }
}