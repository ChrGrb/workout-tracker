import { m, assertOwner, type Tx, type ZeroAuthData } from "../shared";

export type CreateTemplateArgs = {
  id: string;
  userId: string;
  name: string;
  createdAt: number;
  exerciseTypeIds: string[];
};

export const createTemplate = m(
  async ({
    tx,
    args,
    ctx,
  }: {
    tx: Tx;
    args: CreateTemplateArgs;
    ctx: ZeroAuthData;
  }) => {
    assertOwner(tx, ctx, args.userId);
    await tx.mutate.workoutSessionTemplate.insert({
      id: args.id,
      userId: args.userId,
      name: args.name,
      createdAt: args.createdAt,
    });
    for (const typeId of args.exerciseTypeIds) {
      await tx.mutate._exerciseTypeToWorkoutSessionTemplate.insert({
        A: typeId,
        B: args.id,
      });
    }
  },
);
