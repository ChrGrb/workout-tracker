import { q } from "./shared";
import { zql } from "../schema";

// The user's templates with their attached exercise types.
export const templates = q(({ ctx }) =>
  zql.workoutSessionTemplate
    .where("userId", ctx.userID)
    .related("exerciseTypes"),
);
