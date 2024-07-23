import type { WorkoutSessionFull } from "$lib/utils/prismaTypes";
import type { ExerciseType } from "@prisma/client";
import type { WriteTransaction } from "replicache";

// Mutations
const mutationsExerciseTypeUpdate = async ({
  tx,
  args,
}: {
  tx: WriteTransaction;
  args: { exerciseType: Partial<ExerciseType>; userId: string };
}) => {
  const key = `user/${args.userId}/exerciseType/${args.exerciseType.id}`;

  const exerciseType = JSON.parse(
    ((await tx.get(key)) ?? "").toString()
  ) as ExerciseType;

  if (exerciseType.id !== args.exerciseType.id)
    throw new Error("Exercise type does not exist");

  return await tx.set(
    key,
    JSON.stringify({ ...exerciseType, ...args.exerciseType })
  );
};

export default mutationsExerciseTypeUpdate;
