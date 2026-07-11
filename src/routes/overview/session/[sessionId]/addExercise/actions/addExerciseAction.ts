import { zmutate } from "$lib/zero/outbox";
import generateId from "$lib/utils/generateId";
import type { ExerciseType } from "@prisma/client";

const addExerciseAction = async (
  type: ExerciseType,
  userId: string,
  sessionId: string,
) => {
  const generatedId = generateId();

  await zmutate.exercise.create({
    id: generatedId,
    userId,
    typeId: type.id,
    sessionId,
    createdAt: Date.now(),
  });

  return generatedId;
};

export default addExerciseAction;
