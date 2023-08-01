import type { PageServerLoadEvent } from './$types';
import { redirect } from "@sveltejs/kit";

export async function load({ locals }: PageServerLoadEvent) {
    const session = await locals.getSession();

    if (!session || !session.user) {
        return;
    }

    throw redirect(303, '/overview');
}
