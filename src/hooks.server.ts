import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import Apple from "@auth/core/providers/apple";
import { APPLE_ID, APPLE_SECRET, AUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from "$env/static/private";
import { GOOGLE_ID, GOOGLE_SECRET } from "$env/static/private";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import prismaClient from '$lib/db.server';
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const unprotectedRoutes = ['/auth/login'];

const prisma = new PrismaClient();


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
    providers: [
      GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
      Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET }),
      Apple({
        clientId: APPLE_ID,
        clientSecret: APPLE_SECRET,
      })
    ],
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
      signIn: '/auth/login',
      error: '/auth/login',
    },
    events: {
      signIn: async function (message) {
        // Add settings to user, if they do not yet exist
        // Currently in signin to be backwards compatible without deleting db
        try {
          const user = (await prisma.user.findFirst({
            where: {
              id: message.user.id
            },
            include: {
              settings: true
            }
          }));

          if (user && !user.settings) {
            (await prisma.user.update({
              where: {
                id: message.user.id
              },
              data: {
                settings: {
                  create: {
                  },
                }
              },
              select: {
                settings: true,
                id: true
              }
            }));
          }
        } catch (responseError) {
          console.log(400, (responseError as Error).message);
        }

        console.log("Login function ended");
      }
    },
    cookies: {
      pkceCodeVerifier: {
        name: "next-auth.pkce.code_verifier",
        options: {
          httpOnly: true,
          sameSite: "none",
          path: "/",
          secure: true,
        },
      },
    },
    secret: AUTH_SECRET
  })(...args);
}) satisfies Handle;


export const handle: Handle = sequence(
  handleAuth, authorization
)