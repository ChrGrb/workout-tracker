import { error, json } from "@sveltejs/kit";
import { SignJWT } from "jose";
import { env } from "$env/dynamic/private";
import type { RequestHandler } from "./$types";

// Mints a short-lived JWT for the Zero client. zero-cache forwards this token as a
// Bearer credential to the query/mutate endpoints, which verify it and derive the
// user id from the `sub` claim. This bridges the domain gap between the Vercel app
// (which owns the Auth.js session cookie) and the self-hosted zero-cache — cookie
// forwarding can't carry the app's session cookie across origins.
export const GET: RequestHandler = async (event) => {
  const session = await event.locals.auth();
  const userId = session?.user?.id;

  if (!userId) {
    error(401, "Not authenticated");
  }

  const secret = env.ZERO_AUTH_SECRET;
  if (!secret) {
    error(500, "ZERO_AUTH_SECRET is not configured");
  }

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(new TextEncoder().encode(secret));

  return json({ token });
};
