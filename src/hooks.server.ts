import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import type { Provider } from "@auth/core/providers";

const unprotectedRoutes = ['/auth'];

export const authorization: Handle = (async ({ event, resolve }) => {
  // Protect any routes under /authenticated
  if (!unprotectedRoutes.includes(event.url.pathname)) {
    const session = await event.locals.getSession();
    if (!session) {
      throw redirect(303, "/auth");
    }
  }

  // If the request is still here, just proceed as normally
  return resolve(event);
}) satisfies Handle;

export const handle: Handle = sequence(
  SvelteKitAuth({
    providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }) as Provider],
  }),
  authorization
);