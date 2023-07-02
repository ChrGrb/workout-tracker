import { redirect } from "@sveltejs/kit";

const unprotectedRoutes = ['/', '/login', '/api', '/api/login'];
export const handle = async ({ event, request, resolve }) => {
    const userId = event.cookies.get('user_id');

    if (!userId && !unprotectedRoutes.includes(event.url.pathname)) {
        throw redirect(303, '/login');
    }

    event.locals.userId = userId;

    return resolve(event);
}