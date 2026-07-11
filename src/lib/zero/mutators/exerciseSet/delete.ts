import { m, type Tx } from "../shared";

export const deleteExerciseSet = m(
  async ({ tx, args }: { tx: Tx; args: { id: string } }) => {
    await tx.mutate.exerciseSet.delete({ id: args.id });
  },
);
