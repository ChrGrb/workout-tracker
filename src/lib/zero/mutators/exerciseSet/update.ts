import { m, type Tx, type ZeroAuthData } from "../shared";
import { zql, type ExerciseSetType } from "../../schema";
import { assertValidExerciseSetUpdate } from "./validation";

export type UpdateExerciseSetArgs = {
  id: string;
  exerciseSetType?: ExerciseSetType;
  reps?: number;
  weight?: number;
  additionalWeight?: number;
  notes?: string;
};

// Partial update of a set's editable values. Value validation runs on both the
// client and the server. On the server the set must exist and its exercise must
// belong to the authenticated user (sets carry no userId of their own). The
// write names each editable field explicitly (never spreads args) so a client
// cannot move exerciseId or rewrite createdAt/time.
export const updateExerciseSet = m(
  async ({
    tx,
    args,
    ctx,
  }: {
    tx: Tx;
    args: UpdateExerciseSetArgs;
    ctx: ZeroAuthData;
  }) => {
    assertValidExerciseSetUpdate(args);

    if (tx.location === "server") {
      if (!ctx) throw new Error("Not authorized");
      const [set] = await tx.run(zql.exerciseSet.where("id", args.id));
      if (!set) throw new Error("Not authorized");
      const [exercise] = await tx.run(
        zql.exercise.where("id", set.exerciseId),
      );
      if (!exercise || exercise.userId !== ctx.userID) {
        throw new Error("Not authorized");
      }
    }

    await tx.mutate.exerciseSet.update({
      id: args.id,
      ...(args.exerciseSetType !== undefined
        ? { exerciseSetType: args.exerciseSetType }
        : {}),
      ...(args.reps !== undefined ? { reps: args.reps } : {}),
      ...(args.weight !== undefined ? { weight: args.weight } : {}),
      ...(args.additionalWeight !== undefined
        ? { additionalWeight: args.additionalWeight }
        : {}),
      ...(args.notes !== undefined ? { notes: args.notes } : {}),
    });
  },
);
