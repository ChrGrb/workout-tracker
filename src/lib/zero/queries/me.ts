import { q } from "./shared";
import { zql } from "../schema";

// The signed-in user plus their settings.
export const me = q(({ ctx }) =>
  zql.user.where("id", ctx.userID).related("settings").one(),
);
