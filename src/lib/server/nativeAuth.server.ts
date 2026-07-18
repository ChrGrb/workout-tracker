import { SignJWT, jwtVerify, createRemoteJWKSet, decodeJwt } from "jose";
import { env } from "$env/dynamic/private";
import prismaClient from "$lib/db.server";

// Server-side helpers for the native (iOS) auth endpoints. The native app cannot
// use the Auth.js cookie session, so these endpoints establish identity from a
// verified provider credential and hand back:
//   - zeroToken:    the same short-lived HS256 JWT the web app mints at
//                   /api/zero/token (sub = userId, signed with ZERO_AUTH_SECRET)
//   - refreshToken: a longer-lived signed JWT (signed with AUTH_SECRET, a
//                   different secret, with a distinct `typ` claim) the app keeps
//                   in the iOS Keychain and exchanges for fresh zeroTokens.
//
// Security notes:
//   - Identity is NEVER taken from client-supplied fields. Apple/Google identity
//     tokens are verified against the provider JWKS (signature + iss + aud + exp);
//     GitHub identity comes from a server-side code exchange using the client
//     secret. Client-provided name/email are only used as fallback profile data.
//   - refreshTokens are rotated on every use (a fresh one is returned), bounding
//     the lifetime of any single leaked token. They are signed, so tampering is
//     detected; they carry `typ:"refresh"` + iss/aud that are all checked.
//   - zeroToken and refreshToken use different secrets, so one can never be
//     replayed in place of the other.

const ZERO_TOKEN_TTL = "12h";
const REFRESH_TOKEN_TTL = "30d";
const REFRESH_ISS = "workout-tracker/native";
const REFRESH_AUD = "workout-tracker/refresh";

function requireSecret(name: "ZERO_AUTH_SECRET" | "AUTH_SECRET"): Uint8Array {
  const value = env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return new TextEncoder().encode(value);
}

export async function mintZeroToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(ZERO_TOKEN_TTL)
    .sign(requireSecret("ZERO_AUTH_SECRET"));
}

export async function mintRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ typ: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuer(REFRESH_ISS)
    .setAudience(REFRESH_AUD)
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_TTL)
    .sign(requireSecret("AUTH_SECRET"));
}

// Verify a refresh token and return the user id, or null if invalid/expired.
export async function verifyRefreshToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, requireSecret("AUTH_SECRET"), {
      issuer: REFRESH_ISS,
      audience: REFRESH_AUD,
    });
    if (payload.typ !== "refresh" || typeof payload.sub !== "string") return null;
    return payload.sub;
  } catch {
    return null;
  }
}

// --- provider verification --------------------------------------------------

type VerifiedProfile = {
  provider: "apple" | "google" | "github";
  providerAccountId: string;
  email?: string;
  name?: string;
  image?: string;
};

const appleJwks = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"));
const googleJwks = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

// The `aud` of a native Sign in with Apple identity token is the app's bundle id,
// not the web service id. Accept a comma-separated allowlist so both can coexist.
function appleAudiences(): string[] {
  const raw = env.APPLE_NATIVE_BUNDLE_ID ?? env.APPLE_ID ?? "";
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

export async function verifyAppleIdentityToken(
  identityToken: string,
  fallback: { email?: string; name?: string },
): Promise<VerifiedProfile> {
  const audience = appleAudiences();
  if (audience.length === 0) throw new Error("APPLE_NATIVE_BUNDLE_ID is not configured");

  const { payload } = await jwtVerify(identityToken, appleJwks, {
    issuer: "https://appleid.apple.com",
    audience,
  });
  if (typeof payload.sub !== "string") throw new Error("Apple token missing sub");

  const email = typeof payload.email === "string" ? payload.email : fallback.email;
  return { provider: "apple", providerAccountId: payload.sub, email, name: fallback.name };
}

export async function exchangeGoogleCode(input: {
  code: string;
  redirectUri: string;
  codeVerifier?: string;
}): Promise<VerifiedProfile> {
  const clientId = env.GOOGLE_IOS_CLIENT_ID ?? env.GOOGLE_ID;
  if (!clientId) throw new Error("GOOGLE client id is not configured");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: input.code,
    redirect_uri: input.redirectUri,
    client_id: clientId,
  });
  // Native (iOS) OAuth clients have no secret and rely on PKCE; a web client does.
  if (input.codeVerifier) body.set("code_verifier", input.codeVerifier);
  if (env.GOOGLE_IOS_CLIENT_SECRET) body.set("client_secret", env.GOOGLE_IOS_CLIENT_SECRET);
  else if (!env.GOOGLE_IOS_CLIENT_ID && env.GOOGLE_SECRET) body.set("client_secret", env.GOOGLE_SECRET);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error("Google code exchange failed");
  const tokens = (await res.json()) as { id_token?: string };
  if (!tokens.id_token) throw new Error("Google response missing id_token");

  const { payload } = await jwtVerify(tokens.id_token, googleJwks, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: clientId,
  });
  if (typeof payload.sub !== "string") throw new Error("Google token missing sub");

  return {
    provider: "google",
    providerAccountId: payload.sub,
    email: typeof payload.email === "string" ? payload.email : undefined,
    name: typeof payload.name === "string" ? payload.name : undefined,
    image: typeof payload.picture === "string" ? payload.picture : undefined,
  };
}

export async function exchangeGithubCode(input: {
  code: string;
  redirectUri: string;
}): Promise<VerifiedProfile> {
  // A native app needs its own GitHub OAuth App (a GitHub app allows only one
  // set of callback URLs, and the native custom-scheme callback differs from the
  // web Auth.js callback). Use its dedicated credentials, falling back to the web
  // app's if a separate one hasn't been set up.
  const clientId = env.GITHUB_NATIVE_ID ?? env.GITHUB_ID;
  const clientSecret = env.GITHUB_NATIVE_SECRET ?? env.GITHUB_SECRET;
  if (!clientId || !clientSecret) throw new Error("GITHUB client is not configured");

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: input.code,
      redirect_uri: input.redirectUri,
    }),
  });
  if (!tokenRes.ok) throw new Error("GitHub code exchange failed");
  // GitHub returns HTTP 200 even on failure, with an { error, error_description }
  // body — surface it so redirect_uri / code mismatches are debuggable.
  const token = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };
  if (token.error) {
    throw new Error(`GitHub token error: ${token.error} (${token.error_description ?? ""})`);
  }
  if (!token.access_token) throw new Error("GitHub response missing access_token");

  const auth = { authorization: `Bearer ${token.access_token}`, accept: "application/vnd.github+json", "user-agent": "workout-tracker" };
  const userRes = await fetch("https://api.github.com/user", { headers: auth });
  if (!userRes.ok) throw new Error("GitHub user lookup failed");
  const profile = (await userRes.json()) as { id: number; name?: string; login: string; avatar_url?: string };

  // Prefer the primary verified email (the /user endpoint often omits email).
  let email: string | undefined;
  const emailRes = await fetch("https://api.github.com/user/emails", { headers: auth });
  if (emailRes.ok) {
    const emails = (await emailRes.json()) as { email: string; primary: boolean; verified: boolean }[];
    email = emails.find((e) => e.primary && e.verified)?.email ?? emails.find((e) => e.verified)?.email;
  }

  return {
    provider: "github",
    providerAccountId: String(profile.id),
    email,
    name: profile.name ?? profile.login,
    image: profile.avatar_url,
  };
}

// --- user resolution --------------------------------------------------------

// Resolve (or create) the app user for a verified provider identity, mirroring
// what the Auth.js PrismaAdapter does: look up the linked Account; otherwise
// create a User (with a Settings row, matching the signIn backfill in auth.ts)
// and link the Account. Identity is keyed on (provider, providerAccountId) only.
export async function resolveUserId(profile: VerifiedProfile): Promise<string> {
  const existing = await prismaClient.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: profile.provider,
        providerAccountId: profile.providerAccountId,
      },
    },
    select: { userId: true },
  });
  if (existing) return existing.userId;

  const type = profile.provider === "github" ? "oauth" : "oidc";
  const user = await prismaClient.user.create({
    data: {
      name: profile.name ?? null,
      email: profile.email ?? null,
      image: profile.image ?? null,
      settings: { create: {} },
      accounts: {
        create: {
          type,
          provider: profile.provider,
          providerAccountId: profile.providerAccountId,
        },
      },
    },
    select: { id: true },
  });
  return user.id;
}

export async function issueSession(userId: string) {
  const [zeroToken, refreshToken] = await Promise.all([
    mintZeroToken(userId),
    mintRefreshToken(userId),
  ]);
  return { userId, zeroToken, refreshToken };
}

// Exposed for potential debugging/telemetry; not used to establish identity.
export function unsafeDecode(token: string) {
  try {
    return decodeJwt(token);
  } catch {
    return null;
  }
}
