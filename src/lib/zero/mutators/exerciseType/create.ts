import { m, assertOwner, type Tx, type ZeroAuthData } from "../shared";
import type { ExerciseTypeArea, ExerciseTypeCategory } from "../../schema";

export type CreateExerciseTypeArgs = {
  id: string;
  userId: string;
  name: string;
  category: ExerciseTypeCategory;
  area?: ExerciseTypeArea;
  description?: string;
  equipmentId?: string;
};

export const createExerciseType = m(
  async ({
    tx,
    args,
    ctx,
  }: {
    tx: Tx;
    args: CreateExerciseTypeArgs;
    ctx: ZeroAuthData;
  }) => {
    assertOwner(tx, ctx, args.userId);
    await tx.mutate.exerciseType.insert({
      id: args.id,
      name: args.name,
      category: args.category,
      area: args.area,
      description: args.description,
      equipmentId: args.equipmentId,
    });
    // Link the type to the user (implicit M2M join table, A=type, B=user).
    await tx.mutate._exerciseTypeToUser.insert({ A: args.id, B: args.userId });
  },
);
