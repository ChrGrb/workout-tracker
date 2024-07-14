import type { ExerciseFull, WorkoutSessionFull } from "$lib/utils/prismaTypes";
import type {
  Exercise,
  ExerciseSet,
  ExerciseType,
  WorkoutSession,
} from "@prisma/client";
import type { WriteTransaction } from "replicache";

// Mutations
const mutationsExerciseSetDelete = async ({
  tx,
  args,
}: {
  tx: WriteTransaction;
  args: { exercise: ExerciseFull; exerciseSet: ExerciseSet };
}) => {
  const key = `user/${args.exercise.userId}/session/${args.exercise.sessionId}`;

  if (!(await tx.has(key))) throw new Error("Session does not exist");

  const session = JSON.parse(
    ((await tx.get(key)) ?? "").toString()
  ) as WorkoutSessionFull;

  // Find index of exercise to delete set from
  const exerciseIndex = session.exercises.findIndex(
    (exercise) => exercise.id === args.exercise.id
  );

  if (exerciseIndex === -1) throw new Error("Exercise does not exist");

  const exercise = session.exercises[exerciseIndex];
  if (!exercise.sets) throw new Error("Exercise Set does not exist");

  // Find index of set to delete
  const exerciseSetIndex = exercise.sets.findIndex(
    (set) => set.id === args.exerciseSet.id
  );
  if (exerciseSetIndex === -1) throw new Error("Exercise Set does not exist");

  exercise.sets[exerciseSetIndex].isDeleted = true;

  return await tx.set(key, JSON.stringify({ ...session }));
};

export default mutationsExerciseSetDelete;
