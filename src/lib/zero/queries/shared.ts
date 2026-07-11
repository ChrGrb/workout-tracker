import { defineQueryWithType } from "@rocicorp/zero";
import type { Schema } from "../schema";

// Read authorization context: every query scopes to `ctx.userID`, re-evaluated on
// the server with the verified user id.
export type QueryContext = { userID: string };

// The typed query factory shared by every query file.
export const q = defineQueryWithType<Schema, QueryContext>();
