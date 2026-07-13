import { q } from "./shared";
import { zql } from "../schema";

// The user's equipment/machines (direct userId FK).
export const equipment = q(({ ctx }) =>
  zql.equipment.where("userId", ctx.userID),
);
