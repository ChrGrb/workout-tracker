import { m, type Tx } from "../shared";
import type { ExerciseTypeArea, ExerciseTypeCategory } from "../../schema";

export type UpdateExerciseTypeArgs = {
  id: string;
  name?: string;
  category?: ExerciseTypeCategory;
  area?: ExerciseTypeArea;
  description?: string;
};

export const updateExerciseType = m(
  async ({ tx, args }: { tx: Tx; args: UpdateExerciseTypeArgs }) => {
    await tx.mutate.exerciseType.update({
      id: args.id,
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.category !== undefined ? { category: args.category } : {}),
      ...(args.area !== undefined ? { area: args.area } : {}),
      ...(args.description !== undefined
        ? { description: args.description }
        : {}),
    });
  },
);
