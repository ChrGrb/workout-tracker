import type { Exercise, PrismaClient } from "@prisma/client";

const utilsApiMutationsExerciseCreate = async ({
  args,
  userId,
  tx,
  versionNext,
}: {
  args: Exercise;
  userId: string;
  tx: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >;
  versionNext: number;
}) => {
  const prismaTodoFindUnique = await tx.exercise.findUnique({
    where: { id: args.id },
  });

  if (prismaTodoFindUnique) return;

  const prismaData = {
    versionUpdatedAt: versionNext,
    id: args.id,
    userId: args.userId,
    score: 0,
    typeId: args.typeId,
    createdAt: args.createdAt,
    isDeleted: false,
  } as Exercise;

  try {
    await tx.workoutSession.update({
      where: {
        id: args.sessionId,
      },
      data: {
        // --- SYSTEM ---
        versionUpdatedAt: versionNext,
        exercises: {
          create: prismaData,
        },
      },
    });
  } catch (err) {
    console.error((err as Error).message);
  }

  return;
};

export default utilsApiMutationsExerciseCreate;
