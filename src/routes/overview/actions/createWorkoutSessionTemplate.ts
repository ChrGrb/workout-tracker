import { zmutate } from "$lib/zero/outbox";
import generateId from "$lib/utils/generateId";
import type { ExerciseType } from "@prisma/client";

const createWorkoutSessionTemplateAction = (
  userId: string,
  exerciseTypes: ExerciseType[],
  name: string,
) => {
  zmutate.template.create({
    id: generateId(),
    name,
    userId,
    createdAt: Date.now(),
    exerciseTypeIds: exerciseTypes.map((type) => type.id),
  });
};

export default createWorkoutSessionTemplateAction;
