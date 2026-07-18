import { json, error } from "@sveltejs/kit";
import { z } from "zod";
import {
  exchangeGoogleCode,
  exchangeGithubCode,
  resolveUserId,
  issueSession,
} from "$lib/server/nativeAuth.server";
import type { RequestHandler } from "./$types";

// Native Google / GitHub sign-in: the app performs the authorization request
// (PKCE for Google) and sends us the resulting authorization code. We exchange
// it server-side — this is where the OAuth client secret lives — verify the
// resulting identity, and issue our session.
const bodySchema = z.object({
  provider: z.enum(["google", "github"]),
  code: z.string().min(1),
  redirectUri: z.string().url(),
  codeVerifier: z.string().optional(),
});

export const POST: RequestHandler = async ({ request }) => {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) error(400, "Invalid request");

  const { provider, code, redirectUri, codeVerifier } = parsed.data;

  try {
    const profile =
      provider === "google"
        ? await exchangeGoogleCode({ code, redirectUri, codeVerifier })
        : await exchangeGithubCode({ code, redirectUri, codeVerifier });
    const userId = await resolveUserId(profile);
    return json(await issueSession(userId));
  } catch (e) {
    console.error(`native ${provider} auth failed:`, (e as Error).message);
    error(401, "Authentication failed");
  }
};
