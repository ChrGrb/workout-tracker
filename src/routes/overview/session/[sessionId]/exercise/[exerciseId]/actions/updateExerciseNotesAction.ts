import { zmutate } from "$lib/zero/outbox";
import type { ExerciseFull } from "$lib/utils/prismaTypes";

// Saves the per-type note (stored in the type's `description`). Only written
// when it actually changed; an empty string clears the note.
const updateExerciseNotesAction = (
  exercise: ExerciseFull,
  { typeNotes }: { typeNotes: string },
) => {
  const next = typeNotes.trim();
  if (next !== (exercise.type.description ?? "")) {
    zmutate.exerciseType.update({ id: exercise.typeId, description: next });
  }
};

export default updateExerciseNotesAction;
