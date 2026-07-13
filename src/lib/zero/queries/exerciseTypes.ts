import { q } from "./shared";
import { zql } from "../schema";

// The user's exercise-type picker (types linked to them via the join table).
export const exerciseTypes = q(({ ctx }) =>
  zql.exerciseType
    .whereExists("users", (u) => u.where("id", ctx.userID))
    .related("equipment"),
);
