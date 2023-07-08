import type { PageServerLoadEvent } from './$types';
import type { User, Workout } from '@prisma/client';
import { error, redirect } from "@sveltejs/kit";
import { signOut } from "@auth/sveltekit/client";

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, cookies, locals }: PageServerLoadEvent) {
    const session = await locals.getSession();

    if (!session || !session.user) {
        //throw error(400, 'No user provided');
        return;
    }

    try {
        await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ email: session.user.email }),
            headers: {
                "content-type": "application/json",
            },
        });
    } catch (responseError) {
        signOut();
        throw error(400, 'Could not login user');
    }

    throw redirect(303, '/overview');
}
