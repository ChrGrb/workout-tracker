import { json, error } from "@sveltejs/kit";
import { z } from "zod";
import {
  verifyAppleIdentityToken,
  resolveUserId,
  issueSession,
} from "$lib/server/nativeAuth.server";
import type { RequestHandler } from "./$types";

// Native "Sign in with Apple": the app sends the Apple identity token from the
// on-device credential sheet; we verify it against Apple's JWKS and issue our
// session. name/email are only present on the user's first consent, so they are
// accepted as fallback profile data (identity comes from the verified `sub`).
const bodySchema = z.object({
  identityToken: z.string().min(1),
  fullName: z.string().optional(),
  email: z.string().email().optional(),
});

export const POST: RequestHandler = async ({ request }) => {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) error(400, "Invalid request");

  try {
    const profile = await verifyAppleIdentityToken(parsed.data.identityToken, {
      email: parsed.data.email,
      name: parsed.data.fullName,
    });
    const userId = await resolveUserId(profile);
    return json(await issueSession(userId));
  } catch (e) {
    console.error("native apple auth failed:", (e as Error).message);
    error(401, "Authentication failed");
  }
};
