import type { ExerciseFull, WorkoutSessionFull } from "$lib/utils/prismaTypes";
import type { WriteTransaction } from "replicache";

// Mutations
const mutationsExerciseDelete = async ({
  tx,
  args,
}: {
  tx: WriteTransaction;
  args: ExerciseFull;
}) => {
  const key = `user/${args.userId}/session/${args.sessionId}`;

  if (!(await tx.has(key))) throw new Error("Session does not exist");

  const session = JSON.parse(
    ((await tx.get(key)) ?? "").toString()
  ) as WorkoutSessionFull;

  const exerciseIndex = session.exercises.findIndex(
    (exercise) => exercise.id === args.id
  );

  if (exerciseIndex === -1) throw new Error("Exercise does not exist");

  session.exercises[exerciseIndex].isDeleted = true;

  return await tx.set(key, JSON.stringify({ ...session }));
};

export default mutationsExerciseDelete;
