import { defineMutatorWithType, type Transaction } from "@rocicorp/zero";
import type { Schema } from "../schema";

// Context carried into every mutator: the authenticated user on the server, the
// signed-in user from the Z instance on the client.
export type ZeroAuthData = { userID: string } | undefined;
export type Tx = Transaction<Schema>;

// The typed mutator factory shared by every mutator file.
export const m = defineMutatorWithType<Schema, ZeroAuthData>();

// On the server, refuse to act for a different user than the token says.
export function assertOwner(tx: Tx, ctx: ZeroAuthData, userId: string) {
  if (tx.location === "server" && ctx && ctx.userID !== userId) {
    throw new Error("Not authorized");
  }
}
