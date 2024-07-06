import type { ExerciseType, PrismaClient } from "@prisma/client";

const utilsApiMutationsExerciseTypeCreate = async ({
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

  if (prismaExerciseTypeFindUnique) return;

  const prismaData = {
    versionUpdatedAt: versionNext,
    id: args.exerciseType.id,
    name: args.exerciseType.name,
    category: args.exerciseType.category,
    description: args.exerciseType.description,
    isDeleted: false,
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
          create: prismaData,
        },
      },
    });
  } catch (err) {
    console.error((err as Error).message);
  }

  return;
};

export default utilsApiMutationsExerciseTypeCreate;
