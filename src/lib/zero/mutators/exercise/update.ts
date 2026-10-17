import { m, type Tx, type ZeroAuthData } from "../shared";
import { zql } from "../../schema";

export type UpdateExerciseArgs = { id: string; notes: string };

// Only the per-exercise note is editable. On the server the row must exist and
// belong to the authenticated user; the write names `notes` explicitly (never
// spreads args) so a client cannot move userId/sessionId/typeId.
export const updateExercise = m(
  async ({
    tx,
    args,
    ctx,
  }: {
    tx: Tx;
    args: UpdateExerciseArgs;
    ctx: ZeroAuthData;
  }) => {
    if (tx.location === "server") {
      const [row] = await tx.run(zql.exercise.where("id", args.id));
      if (!ctx || !row || row.userId !== ctx.userID) {
        throw new Error("Not authorized");
      }
    }
    await tx.mutate.exercise.update({
      id: args.id,
      notes: String(args.notes),
    });
  },
);
