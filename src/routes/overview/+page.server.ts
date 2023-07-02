import type { PageServerLoadEvent } from './$types';
import type { User, Workout } from '@prisma/client';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, cookies, depends }: PageServerLoadEvent) {
    const userId = cookies.get('user_id');

    depends('app:user');
    const responseUser = await fetch("/api/user?userId=" + userId);
    const user = (await responseUser.json()) as User;

    depends('app:workouts');
    const responseWorkouts = await fetch("/api/workout?userId=" + userId);
    const workouts = (await responseWorkouts.json()) as Workout[];

    return {
        user: user,
        workouts: workouts
    };
}
