import type { PageServerLoadEvent } from './$types';
import type { User, Workout } from '@prisma/client';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, cookies, depends, locals }: PageServerLoadEvent) {
    const session = await locals.getSession();

    depends('app:user');
    const responseUser = await fetch("/api/user?email=" + session.user.email);
    const user = (await responseUser.json()) as User;

    depends('app:workouts');
    const responseWorkouts = await fetch("/api/workout?userId=" + user.id);
    const workouts = (await responseWorkouts.json()) as Workout[];

    return {
        user: user,
        workouts: workouts
    };
}
