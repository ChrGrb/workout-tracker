import type { PageServerLoadEvent } from './$types';
import type { User, Workout, Session } from '@prisma/client';
import { Prisma } from '@prisma/client';

export async function load({ fetch, cookies, depends, locals }: PageServerLoadEvent) {
    const session = await locals.getSession();

    const sessionWithWorkouts = Prisma.validator<Prisma.SessionArgs>()({
        include: { workouts: true },
    });

    type SessionWithWorkouts = Prisma.SessionGetPayload<typeof sessionWithWorkouts>


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
        workouts = (await responseWorkouts.json()) as SessionWithWorkouts;
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

        const response = await fetch(
            "/api/session",
            {
                method: "POST",
                body: JSON.stringify({ session: session }),
                headers: {
                    "content-type": "application/json",
                },
            }
        );

        const responseJson = await response.json();
    },
    finishCurrentSession: async ({ request, fetch }: RequestEvent) => {
        const form = await request.formData();
        const sessionId = Number(form.get("sessionId"));

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
    }
}