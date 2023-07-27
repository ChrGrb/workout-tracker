import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private";
import { GOOGLE_ID, GOOGLE_SECRET } from "$env/static/private";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import type { Provider } from "@auth/core/providers";
import prismaClient from '$lib/db.server';
import { PrismaAdapter } from "@auth/prisma-adapter";

const unprotectedRoutes = ['/auth/login'];


export const authorization: Handle = (async ({ event, resolve }) => {
  // Redirect to application from base path
  if (event.url.pathname === '/') {
    throw redirect(303, "/auth/login");
  }
  // Protect any routes under /authenticated
  if (!unprotectedRoutes.includes(event.url.pathname)) {
    const session = await event.locals.getSession();
    if (!session) {
      throw redirect(303, "/auth/login");
    }
  }

  // If the request is still here, just proceed as normally
  return resolve(event);
}) satisfies Handle;

const handleAuth: Handle = (async (...args) => {
  const [{ event }] = args;
  return SvelteKitAuth({
    adapter: PrismaAdapter(prismaClient),
    providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }), Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET })],

    callbacks: {
      async session({ session, user }) {
        session.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
        event.locals.session = session;
        return session;
      },
    },
    pages: {
      signIn: '/auth/login'
    }
  })(...args);
}) satisfies Handle;


export const handle: Handle = sequence(
  handleAuth, authorization
)