import type { ExerciseType, WorkoutSession } from "@prisma/client";
import type { WriteTransaction } from "replicache";

// Mutations
const mutationsExerciseTypeDelete = async ({
  tx,
  args,
}: {
  tx: WriteTransaction;
  args: { exerciseType: ExerciseType; userId: string };
}) => {
  const key = `user/${args.userId}/exerciseType/${args.exerciseType.id}`;

  const exerciseType = JSON.parse(
    ((await tx.get(key)) ?? "").toString()
  ) as ExerciseType;

  if (exerciseType.id !== args.exerciseType.id)
    throw new Error("Exercise type does not exist");

  exerciseType.isDeleted = true;

  return await tx.set(key, JSON.stringify({ ...exerciseType }));
};

export default mutationsExerciseTypeDelete;
