import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';
import type { Exercise, User, WorkoutSession } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { error } from '@sveltejs/kit';

export async function load({ fetch, cookies, depends, locals }: PageServerLoadEvent) {
    const session = await locals.getSession();

    if (!session || !session.user) {
        throw error(400, 'User not defined');
    }

    const workoutSessionWithExercisesWithType = Prisma.validator<Prisma.WorkoutSessionArgs>()({
        include: { exercises: { include: { type: true } } }
    });
    type WorkoutSessionWithExercisesWithType = Prisma.WorkoutSessionGetPayload<typeof workoutSessionWithExercisesWithType>

    depends("user");
    const userWithSettingsType = Prisma.validator<Prisma.UserArgs>()({
        include: { settings: true }
    });
    type UserWithSettingsType = Prisma.UserGetPayload<typeof userWithSettingsType>

    const responseUser = await fetch("/api/user?id=" + (session.user as User).id);
    const user = (await responseUser.json()) as UserWithSettingsType;

    const previousSessions = async () => {
        const responsePreviousSessions = await fetch("/api/session/previous?userId=" + (session.user as User)?.id);
        return (await responsePreviousSessions.json()) as (WorkoutSession & { exercises: Exercise[] })[];
    }

    const currentSessionExercises = async () => {
        const responseCurrentSession = await fetch("/api/session/current?userId=" + user.id);
        const currentSession = (await responseCurrentSession.json()) as WorkoutSession;

        if (currentSession !== null) {
            const responseExercises = await fetch("/api/session/" + currentSession.id + "/exercises");
            return (await responseExercises.json()) as WorkoutSessionWithExercisesWithType ?? null;
        }

        return null;
    }

    return {
        user,
        streamed: {
            currentSessionExercises: currentSessionExercises(),
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

        const workoutSession = { userId: (session.user as User).id };

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
    },
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
    },
    updateCurrentSessionName: async ({ request, fetch }: RequestEvent) => {
        const form = await request.formData();
        const sessionId = form.get("sessionId");
        const newSessionName = form.get("sessionName");

        try {
            await fetch(
                "/api/session/" + sessionId + "/rename",
                {
                    method: "PUT",
                    body: JSON.stringify({ newSessionName: newSessionName }),
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
        } catch (responseError) {
            throw error(400, 'Could not finish current session');
        }
    },
    updateTimerSettings: async ({ request, fetch }: RequestEvent) => {
        const form = await request.formData();
        const timerEnabled = form.get("timerEnabled");
        const timerDuration = form.get("timerDuration");
        const userId = form.get("userId");

        try {
            await fetch(
                "/api/user/" + userId + "/settings/timer",
                {
                    method: "PUT",
                    body: JSON.stringify({ enabled: timerEnabled, duration: timerDuration }),
                    headers: {
                        "content-type": "application/json",
                    }
                }
            );
        } catch (responseError) {
            throw error(400, 'Could not finish current session');
        }
    }
}