import { m, type Tx } from "../shared";
import { zql } from "../../schema";

export const deleteTemplate = m(
  async ({ tx, args }: { tx: Tx; args: { id: string } }) => {
    const existing = await tx.run(
      zql._exerciseTypeToWorkoutSessionTemplate.where("B", args.id),
    );
    for (const row of existing) {
      await tx.mutate._exerciseTypeToWorkoutSessionTemplate.delete({
        A: row.A,
        B: row.B,
      });
    }
    await tx.mutate.workoutSessionTemplate.delete({ id: args.id });
  },
);
