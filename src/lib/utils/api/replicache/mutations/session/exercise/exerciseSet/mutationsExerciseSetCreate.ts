import prisma from "$lib/db.server";
import type { ExerciseAverage } from "$lib/types/exerciseAverage";
import type { Exercise, ExerciseSet, PrismaClient } from "@prisma/client";

const utilsApiMutationsExerciseSetCreate = async ({
  args,
  tx,
  versionNext,
}: {
  args: { exercise: Exercise; exerciseSet: ExerciseSet };
  tx: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >;
  versionNext: number;
}) => {
  const prismaExerciseSetFindUnique = await tx.exerciseSet.findUnique({
    where: { id: args.exerciseSet.id },
  });

  if (prismaExerciseSetFindUnique) return;

  const prismaData = {
    versionUpdatedAt: versionNext,
    id: args.exerciseSet.id,
    exerciseId: args.exerciseSet.exerciseId,
    exerciseSetType: args.exerciseSet.exerciseSetType,
    reps: args.exerciseSet.reps,
    weight: args.exerciseSet.weight,
    additionalWeight: args.exerciseSet.additionalWeight,
    time: args.exerciseSet.time,
    createdAt: args.exerciseSet.createdAt,
    notes: args.exerciseSet.notes,
    isDeleted: false,
  } as ExerciseSet;

  try {
    await tx.exercise.update({
      where: {
        id: args.exercise.id,
      },
      data: {
        // --- SYSTEM ---
        versionUpdatedAt: versionNext,
        sets: {
          create: prismaData,
        },
      },
    });

    // Update workoutSession, so replicache knows it's been udated
    await tx.workoutSession.update({
      where: {
        id: args.exercise.sessionId,
      },
      data: {
        versionUpdatedAt: versionNext,
      },
    });
  } catch (err) {
    console.error((err as Error).message);
  }

  return;
};

export default utilsApiMutationsExerciseSetCreate;
