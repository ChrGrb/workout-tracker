import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';
import type { User, Workout, Session } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { error } from '@sveltejs/kit';

export async function load({ fetch, cookies, depends, locals }: PageServerLoadEvent) {
    const session = await locals.getSession();

    if (!session || !session.user) {
        throw error(400, 'User not defined');
    }

    const sessionWithWorkoutsWithType = Prisma.validator<Prisma.SessionArgs>()({
        include: { workouts: { include: { workoutType: true } } }
    },
    );

    type SessionWithWorkoutsWithType = Prisma.SessionGetPayload<typeof sessionWithWorkoutsWithType>


    depends('app:user');
    const responseUser = await fetch("/api/user?email=" + session.user.email);
    const user = (await responseUser.json()) as User;

    depends('app:previousSessions');
    const responsePreviousSessions = await fetch("/api/session/previous?userId=" + user.id);
    const previousSessions = (await responsePreviousSessions.json()) as Session[];

    depends('app:currentSession');
    const responseCurrentSession = await fetch("/api/session/current?userId=" + user.id);
    const currentSession = (await responseCurrentSession.json()) as Session;

    let workouts;

    if (currentSession !== null) {
        depends('app:workouts');
        const responseWorkouts = await fetch("/api/session/" + currentSession.id + "/workouts");
        workouts = (await responseWorkouts.json()) as SessionWithWorkoutsWithType;
    }


    return {
        user: user,
        sessionCurrent: workouts !== undefined ? workouts : null,
        sessionsPrevious: previousSessions
    };
}


export const actions: Actions = {
    createSession: async ({ request, fetch }: RequestEvent) => {
        const form = await request.formData();
        const userId = Number(form.get("userId"));
        const session = { userId: userId };

        try {
            await fetch(
                "/api/session",
                {
                    method: "POST",
                    body: JSON.stringify({ session: session }),
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
        const sessionId = Number(form.get("sessionId"));

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