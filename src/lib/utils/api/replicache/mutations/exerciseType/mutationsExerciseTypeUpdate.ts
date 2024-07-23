import type { ExerciseType, PrismaClient } from "@prisma/client";

const utilsApiMutationsExerciseTypeUpdate = async ({
  args,
  tx,
  versionNext,
}: {
  args: { exerciseType: ExerciseType; userId: string };
  tx: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >;
  versionNext: number;
}) => {
  const prismaExerciseTypeFindUnique = await tx.exerciseType.findUnique({
    where: { id: args.exerciseType.id },
  });

  if (!prismaExerciseTypeFindUnique) return;

  const prismaData = {
    ...prismaExerciseTypeFindUnique,
    ...args.exerciseType,
  } as ExerciseType;

  try {
    await tx.user.update({
      where: {
        id: args.userId,
      },
      data: {
        // --- SYSTEM ---
        versionUpdatedAt: versionNext,
        exerciseTypes: {
          update: {
            where: {
              id: args.exerciseType.id,
            },
            data: {
              ...prismaData,
              versionUpdatedAt: versionNext,
            },
          },
        },
      },
      include: {
        exerciseTypes: true,
      },
    });
  } catch (err) {
    console.error((err as Error).message);
  }

  return;
};

export default utilsApiMutationsExerciseTypeUpdate;
