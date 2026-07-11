import { jwtVerify } from "jose";
import { env } from "$env/dynamic/private";

/**
 * Verifies the Bearer JWT that zero-cache forwards to the query/mutate endpoints
 * and returns the authenticated user id (the `sub` claim). Tokens are minted by
 * /api/zero/token from the Auth.js session and signed with ZERO_AUTH_SECRET.
 */
export async function userIdFromRequest(
  request: Request,
): Promise<string | undefined> {
  const header = request.headers.get("authorization");
  const token = header?.toLowerCase().startsWith("bearer ")
    ? header.slice(7)
    : undefined;
  if (!token) return undefined;

  const secret = env.ZERO_AUTH_SECRET;
  if (!secret) throw new Error("ZERO_AUTH_SECRET is not configured");

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );
    return typeof payload.sub === "string" ? payload.sub : undefined;
  } catch {
    return undefined;
  }
}
