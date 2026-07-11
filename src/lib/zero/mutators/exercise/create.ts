import { m, assertOwner, type Tx, type ZeroAuthData } from "../shared";

export type CreateExerciseArgs = {
  id: string;
  userId: string;
  typeId: string;
  sessionId: string;
  createdAt: number;
};

export const createExercise = m(
  async ({
    tx,
    args,
    ctx,
  }: {
    tx: Tx;
    args: CreateExerciseArgs;
    ctx: ZeroAuthData;
  }) => {
    assertOwner(tx, ctx, args.userId);
    await tx.mutate.exercise.insert({
      id: args.id,
      userId: args.userId,
      typeId: args.typeId,
      sessionId: args.sessionId,
      createdAt: args.createdAt,
      score: 0,
    });
  },
);
