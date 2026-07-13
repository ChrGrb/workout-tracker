import { zmutate } from "$lib/zero/outbox";
import type { ExerciseType } from "@prisma/client";
import type {
  ExerciseTypeArea,
  ExerciseTypeCategory,
} from "$lib/zero/schema";

const updateExerciseTypeAction = (
  exerciseType: Partial<ExerciseType>,
  // userId retained for call-site compatibility; ownership is enforced server-side.
  _userId: string,
) => {
  if (!exerciseType.id) return;
  zmutate.exerciseType.update({
    id: exerciseType.id,
    name: exerciseType.name,
    category: exerciseType.category as ExerciseTypeCategory | undefined,
    area: (exerciseType.area ?? undefined) as ExerciseTypeArea | undefined,
    description: exerciseType.description ?? undefined,
    equipmentId: exerciseType.equipmentId,
  });
};

export default updateExerciseTypeAction;
