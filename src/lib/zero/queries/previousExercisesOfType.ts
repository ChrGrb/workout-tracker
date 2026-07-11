import { q, type QueryContext } from "./shared";
import { zql } from "../schema";

// Past exercises of a given type for score history.
export const previousExercisesOfType = q(
  ({ args, ctx }: { args: { typeId: string }; ctx: QueryContext }) =>
    zql.exercise
      .where("userId", ctx.userID)
      .where("typeId", args.typeId)
      .related("sets")
      .related("type")
      .orderBy("createdAt", "desc"),
);
