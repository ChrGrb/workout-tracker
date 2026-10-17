import { zmutate } from "$lib/zero/outbox";
import type { ExerciseFull } from "$lib/utils/prismaTypes";

// Saves the per-exercise note and/or the per-type note (stored in the type's
// `description`). Only fields that actually changed are written; an empty
// string clears a note.
const updateExerciseNotesAction = (
  exercise: ExerciseFull,
  { notes, typeNotes }: { notes?: string; typeNotes?: string },
) => {
  if (notes !== undefined) {
    const next = notes.trim();
    if (next !== (exercise.notes ?? "")) {
      zmutate.exercise.update({ id: exercise.id, notes: next });
    }
  }
  if (typeNotes !== undefined) {
    const next = typeNotes.trim();
    if (next !== (exercise.type.description ?? "")) {
      zmutate.exerciseType.update({ id: exercise.typeId, description: next });
    }
  }
};

export default updateExerciseNotesAction;
