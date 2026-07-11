import { m, type Tx } from "../shared";
import { zql } from "../../schema";

export const deleteExercise = m(
  async ({ tx, args }: { tx: Tx; args: { id: string } }) => {
    const sets = await tx.run(zql.exerciseSet.where("exerciseId", args.id));
    for (const set of sets) {
      await tx.mutate.exerciseSet.delete({ id: set.id });
    }
    await tx.mutate.exercise.delete({ id: args.id });
  },
);
