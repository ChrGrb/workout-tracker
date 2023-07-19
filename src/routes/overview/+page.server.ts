import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';
import type { User, Workout, Session } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { error } from '@sveltejs/kit';

export async function load({ fetch, cookies, depends, locals }: PageServerLoadEvent) {
    const session = await locals.getSession();

    if (!session || !session.user) {
        throw error(400, 'User not defined');
    }

    const workoutSessionWithWorkoutsWithType = Prisma.validator<Prisma.WorkoutSessionArgs>()({
        include: { workouts: { include: { workoutType: true } } }
    },
    );

    type WorkoutSessionWithWorkoutsWithType = Prisma.WorkoutSessionGetPayload<typeof workoutSessionWithWorkoutsWithType>


    depends('app:user');
    const responseUser = await fetch("/api/user?id=" + session.user.id);
    const user = (await responseUser.json()) as User;

    depends('app:previousSessions');
    const previousSessions = async () => {
        const responsePreviousSessions = await fetch("/api/session/previous?userId=" + user.id);
        return (await responsePreviousSessions.json()) as Session[];
    }

    depends('app:currentSession');
    const currentSessionWorkouts = async () => {
        const responseCurrentSession = await fetch("/api/session/current?userId=" + user.id);
        const currentSession = (await responseCurrentSession.json()) as Session;

        if (currentSession !== null) {
            const responseWorkouts = await fetch("/api/session/" + currentSession.id + "/workouts");
            return (await responseWorkouts.json()) as WorkoutSessionWithWorkoutsWithType ?? null;
        }

        return null;
    }

    return {
        user,
        streamed: {
            currentSessionWorkouts: currentSessionWorkouts(),
            previousSessions: previousSessions()
        }
    };
}


export const actions: Actions = {
    createSession: async ({ request, fetch, locals }: RequestEvent) => {
        const session = await locals.getSession();

        if (!session || !session.user) {
            throw error(400, 'User not defined');
        }

        const workoutSession = { userId: session.user.id };

        try {
            await fetch(
                "/api/session",
                {
                    method: "POST",
                    body: JSON.stringify({ session: workoutSession }),
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
        } catch (responseError) {
            throw error(400, 'Could not create a new session');
        }
    },
    finishCurrentSession: async ({ request, fetch }: RequestEvent) => {
        const form = await request.formData();
        const sessionId = form.get("sessionId");

        try {
            await fetch(
                "/api/session/" + sessionId + "/finish",
                {
                    method: "POST",
                    body: JSON.stringify({ sessionId: sessionId }),
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
        } catch (responseError) {
            throw error(400, 'Could not finish current session');
        }
    }
}