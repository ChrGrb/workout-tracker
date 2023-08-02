import type { PageServerLoadEvent } from './$types';
import { redirect } from "@sveltejs/kit";

export async function load({ locals, url }: PageServerLoadEvent) {
    const session = await locals.getSession();
    const error = url.searchParams.get('error');

    if (!session || !session.user) {
        return { error: error };
    }

    throw redirect(303, '/overview');
}
