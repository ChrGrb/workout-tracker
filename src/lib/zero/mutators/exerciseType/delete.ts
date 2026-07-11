import { m, assertOwner, type Tx, type ZeroAuthData } from "../shared";
import { zql } from "../../schema";

// Unlink from the user; hard-delete the type only if no exercise references it
// (mirrors the historical RESTRICT FK — keeps history resolvable).
export const deleteExerciseType = m(
  async ({
    tx,
    args,
    ctx,
  }: {
    tx: Tx;
    args: { id: string; userId: string };
    ctx: ZeroAuthData;
  }) => {
    assertOwner(tx, ctx, args.userId);
    await tx.mutate._exerciseTypeToUser.delete({ A: args.id, B: args.userId });
    const referencing = await tx.run(
      zql.exercise.where("typeId", args.id).limit(1),
    );
    if (referencing.length === 0) {
      await tx.mutate.exerciseType.delete({ id: args.id });
    }
  },
);
