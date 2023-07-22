import type { PageServerLoadEvent } from './$types';
import { error, redirect } from "@sveltejs/kit";
import { signOut } from "@auth/sveltekit/client";

export async function load({ fetch, cookies, locals }: PageServerLoadEvent) {
    const session = await locals.getSession();

    if (!session || !session.user) {
        return;
    }

    throw redirect(303, '/overview');
}
