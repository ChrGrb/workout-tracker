import { json, error } from "@sveltejs/kit";
import { z } from "zod";
import { verifyRefreshToken, issueSession } from "$lib/server/nativeAuth.server";
import type { RequestHandler } from "./$types";

// Exchange a Keychain-stored refresh token for a fresh short-lived Zero JWT. The
// refresh token is rotated on every use (a new one is returned alongside the
// zeroToken) to bound the lifetime of any single leaked token.
const bodySchema = z.object({ refreshToken: z.string().min(1) });

export const POST: RequestHandler = async ({ request }) => {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) error(400, "Invalid request");

  const userId = await verifyRefreshToken(parsed.data.refreshToken);
  if (!userId) error(401, "Invalid refresh token");

  const session = await issueSession(userId);
  return json({ zeroToken: session.zeroToken, refreshToken: session.refreshToken });
};
