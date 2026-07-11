import { m, assertOwner, type Tx, type ZeroAuthData } from "../shared";

export type CreateSessionArgs = {
  id: string;
  userId: string;
  name: string;
  createdAt: number;
};

export const createSession = m(
  async ({
    tx,
    args,
    ctx,
  }: {
    tx: Tx;
    args: CreateSessionArgs;
    ctx: ZeroAuthData;
  }) => {
    assertOwner(tx, ctx, args.userId);
    await tx.mutate.workoutSession.insert({
      id: args.id,
      userId: args.userId,
      name: args.name,
      createdAt: args.createdAt,
      finished: false,
    });
  },
);
