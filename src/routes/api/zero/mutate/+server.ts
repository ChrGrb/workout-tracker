import { error, json } from "@sveltejs/kit";
import { PushProcessor, zeroPostgresJS } from "@rocicorp/zero/pg";
import { env } from "$env/dynamic/private";
import { schema } from "$lib/zero/schema";
import { mutators } from "$lib/zero/mutators";
import { userIdFromRequest } from "$lib/zero/auth.server";
import type { RequestHandler } from "./$types";

// zero-cache forwards each client mutation batch here. We re-run the SAME mutator
// functions the client ran optimistically, but authoritatively against Postgres,
// inside a transaction. The upstream connection must be the DIRECT (non-pooled)
// URL — the same database zero-cache replicates.
const connectionString =
  env.ZERO_UPSTREAM_DB ?? env.POSTGRES_URL_NON_POOLING ?? "";

// The database (connection pool) is shared across requests; the processor is
// per-request so it can carry the authenticated user as mutator context.
const db = zeroPostgresJS(schema, connectionString);

export const POST: RequestHandler = async ({ request }) => {
  const userID = await userIdFromRequest(request);
  if (!userID) error(401, "Not authenticated");

  const processor = new PushProcessor(db, { userID });
  const result = await processor.process(mutators, request);
  return json(result);
};
