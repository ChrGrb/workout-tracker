import { zmutate } from "$lib/zero/outbox";
import generateId from "$lib/utils/generateId";
import type {
  ExerciseTypeArea,
  ExerciseTypeCategory,
} from "$lib/zero/schema";

const createExerciseTypeAction = (
  userId: string,
  exerciseTypeName: string,
  exerciseTypeArea: string | null,
  exerciseCategory: string,
  equipmentId: string | null,
) => {
  const area =
    exerciseTypeArea && exerciseTypeArea !== ""
      ? (exerciseTypeArea as ExerciseTypeArea)
      : undefined;

  zmutate.exerciseType.create({
    id: generateId(),
    userId,
    name: exerciseTypeName,
    category: exerciseCategory as ExerciseTypeCategory,
    area,
    description: "",
    equipmentId: equipmentId ?? undefined,
  });
};

export default createExerciseTypeAction;
