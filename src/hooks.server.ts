// import { redirect } from "@sveltejs/kit";

// const unprotectedRoutes = ['/', '/login', '/api', '/api/login'];
// export const handle = async ({ event, request, resolve }) => {
//     const userId = event.cookies.get('user_id');

//     if (!userId && !unprotectedRoutes.includes(event.url.pathname)) {
//         throw redirect(303, '/login');
//     }

//     event.locals.userId = userId;

//     return resolve(event);
// }

import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const unprotectedRoutes = ['/', '/auth'];
async function authorization({ event, resolve }) {
  // Protect any routes under /authenticated
  if (!unprotectedRoutes.includes(event.url.pathname)) {
    const session = await event.locals.getSession();
    if (!session) {
      throw redirect(303, "/auth");
    }
  }

  // If the request is still here, just proceed as normally
  return resolve(event);
}

export const handle: Handle = sequence(
	SvelteKitAuth({
  	providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
	}), 
	authorization
);