import type { PageServerLoadEvent } from './$types';
import { error, redirect } from "@sveltejs/kit";
import { signOut } from "@auth/sveltekit/client";

export async function load({ fetch, cookies, locals }: PageServerLoadEvent) {
    const session = await locals.getSession();

    if (!session || !session.user) {
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
