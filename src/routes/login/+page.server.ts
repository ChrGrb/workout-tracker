import type { Prisma } from "@prisma/client";
import { redirect } from "@sveltejs/kit";
import { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request, cookies, fetch }) => {
        const form = await request.formData();
        const email = form.get('email');

        const response = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ email: email }),
            headers: {
                "content-type": "application/json"
            },
        });

        let userResponse: Prisma.UserSelect = await response.json();
        let userId = userResponse.id;

        if (userId === null) {
            throw redirect(303, '/login');
        }

        cookies.set('user_id', userId, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            maxAge: 60 * 60 * 24 * 7 // one week
        });
        throw redirect(303, '/overview');
    }
}