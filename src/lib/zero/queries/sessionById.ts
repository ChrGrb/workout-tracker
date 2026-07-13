import { q, type QueryContext } from "./shared";
import { zql } from "../schema";

// A single session (still scoped to the user).
export const sessionById = q(
  ({ args, ctx }: { args: { id: string }; ctx: QueryContext }) =>
    zql.workoutSession
      .where("userId", ctx.userID)
      .where("id", args.id)
      .related("exercises", (e) =>
        e.related("sets").related("type", (t) => t.related("equipment")),
      )
      .one(),
);
