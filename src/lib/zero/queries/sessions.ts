import { q } from "./shared";
import { zql } from "../schema";

// All of the user's sessions, newest first, with exercises -> sets & type (+ equipment).
export const sessions = q(({ ctx }) =>
  zql.workoutSession
    .where("userId", ctx.userID)
    .related("exercises", (e) =>
      e.related("sets").related("type", (t) => t.related("equipment")),
    )
    .orderBy("createdAt", "desc"),
);
