import { m, type Tx, type ZeroAuthData } from "../shared";
import {
  zql,
  type ExerciseTypeArea,
  type ExerciseTypeCategory,
} from "../../schema";

export type UpdateExerciseTypeArgs = {
  id: string;
  name?: string;
  category?: ExerciseTypeCategory;
  area?: ExerciseTypeArea;
  description?: string;
  equipmentId?: string | null;
};

export const updateExerciseType = m(
  async ({
    tx,
    args,
    ctx,
  }: {
    tx: Tx;
    args: UpdateExerciseTypeArgs;
    ctx: ZeroAuthData;
  }) => {
    // On the server, only a user linked to the type (implicit M2M join table,
    // A=type, B=user) may edit it.
    if (tx.location === "server") {
      if (!ctx) throw new Error("Not authorized");
      const [link] = await tx.run(
        zql._exerciseTypeToUser.where("A", args.id).where("B", ctx.userID),
      );
      if (!link) throw new Error("Not authorized");
    }
    await tx.mutate.exerciseType.update({
      id: args.id,
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.category !== undefined ? { category: args.category } : {}),
      ...(args.area !== undefined ? { area: args.area } : {}),
      ...(args.description !== undefined
        ? { description: args.description }
        : {}),
      ...(args.equipmentId !== undefined
        ? { equipmentId: args.equipmentId }
        : {}),
    });
  },
);
