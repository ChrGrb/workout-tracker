import { q } from "./shared";
import { zql } from "../schema";

// All of the user's sessions, newest first, with exercises -> sets & type.
export const sessions = q(({ ctx }) =>
  zql.workoutSession
    .where("userId", ctx.userID)
    .related("exercises", (e) => e.related("sets").related("type"))
    .orderBy("createdAt", "desc"),
);
