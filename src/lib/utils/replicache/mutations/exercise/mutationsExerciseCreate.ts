import type { ExerciseFull, WorkoutSessionFull } from "$lib/utils/prismaTypes";
import type { WriteTransaction } from "replicache";

// Mutations
const mutationsExerciseCreate = async ({
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
  session.exercises.push(args);

  return await tx.set(key, JSON.stringify({ ...session }));
};

export default mutationsExerciseCreate;
