import { m, type Tx } from "../shared";
import { zql } from "../../schema";

// Real delete. Zero's client store has no FK cascade, so remove children first.
export const deleteSession = m(
  async ({ tx, args }: { tx: Tx; args: { id: string } }) => {
    const exercises = await tx.run(zql.exercise.where("sessionId", args.id));
    for (const exercise of exercises) {
      const sets = await tx.run(zql.exerciseSet.where("exerciseId", exercise.id));
      for (const set of sets) {
        await tx.mutate.exerciseSet.delete({ id: set.id });
      }
      await tx.mutate.exercise.delete({ id: exercise.id });
    }
    await tx.mutate.workoutSession.delete({ id: args.id });
  },
);
