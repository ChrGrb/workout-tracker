import { m, type Tx } from "../shared";
import { zql } from "../../schema";

export type UpdateTemplateArgs = {
  id: string;
  name?: string;
  exerciseTypeIds?: string[];
};

export const updateTemplate = m(
  async ({ tx, args }: { tx: Tx; args: UpdateTemplateArgs }) => {
    if (args.name !== undefined) {
      await tx.mutate.workoutSessionTemplate.update({
        id: args.id,
        name: args.name,
      });
    }
    if (args.exerciseTypeIds !== undefined) {
      const existing = await tx.run(
        zql._exerciseTypeToWorkoutSessionTemplate.where("B", args.id),
      );
      for (const row of existing) {
        await tx.mutate._exerciseTypeToWorkoutSessionTemplate.delete({
          A: row.A,
          B: row.B,
        });
      }
      for (const typeId of args.exerciseTypeIds) {
        await tx.mutate._exerciseTypeToWorkoutSessionTemplate.insert({
          A: typeId,
          B: args.id,
        });
      }
    }
  },
);
