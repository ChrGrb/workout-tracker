import { redirect } from '@sveltejs/kit';
import type { Actions, RequestEvent } from './$types';
import { error } from '@sveltejs/kit';

export const actions: Actions = {
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

        throw redirect(300, '/overview');
    }
}