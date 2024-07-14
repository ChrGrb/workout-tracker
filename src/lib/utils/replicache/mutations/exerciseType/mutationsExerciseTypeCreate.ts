import type { WorkoutSessionFull } from "$lib/utils/prismaTypes";
import type { ExerciseType } from "@prisma/client";
import type { WriteTransaction } from "replicache";

// Mutations
const mutationsExerciseTypeCreate = async ({
  tx,
  args,
}: {
  tx: WriteTransaction;
  args: { exerciseType: ExerciseType; userId: string };
}) => {
  const key = `user/${args.userId}/exerciseType/${args.exerciseType.id}`;

  if (await tx.has(key)) throw new Error("Exercise type already exists");

  return await tx.set(key, JSON.stringify({ ...args.exerciseType }));
};

export default mutationsExerciseTypeCreate;
