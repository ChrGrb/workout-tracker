import { error, json } from "@sveltejs/kit";
import { handleQueryRequest } from "@rocicorp/zero/server";
import { mustGetQuery } from "@rocicorp/zero";
import { schema } from "$lib/zero/schema";
import { queries, type QueryContext } from "$lib/zero/queries";
import { userIdFromRequest } from "$lib/zero/auth.server";
import type { RequestHandler } from "./$types";

// zero-cache calls this to resolve each named synced query into a concrete,
// user-scoped AST. The query definitions in queries.ts apply `ctx.userID`, so the
// server decides what each user may read.
export const POST: RequestHandler = async ({ request }) => {
  const userID = await userIdFromRequest(request);
  if (!userID) error(401, "Not authenticated");

  const ctx: QueryContext = { userID };
  const response = await handleQueryRequest({
    schema,
    request,
    userID,
    handler: (name, args) => {
      // Resolve the named query definition and apply the server-side context so
      // the returned AST is scoped to the authenticated user.
      const def = mustGetQuery(queries, name) as unknown as {
        fn: (o: { args: unknown; ctx: QueryContext }) => unknown;
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return def.fn({ args, ctx }) as any;
    },
  });
  return json(response);
};
