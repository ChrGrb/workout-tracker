import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("$lib/zero/outbox", () => ({
  zmutate: {
    exercise: { update: vi.fn() },
    exerciseType: { update: vi.fn() },
  },
}));

import { zmutate } from "$lib/zero/outbox";
import { makeExerciseFull, makeExerciseType } from "$lib/testing/fixtures";
import updateExerciseNotesAction from "./updateExerciseNotesAction";

beforeEach(() => vi.clearAllMocks());

const exercise = () =>
  makeExerciseFull({
    id: "ex-1",
    typeId: "type-1",
    notes: "old",
    type: makeExerciseType({ id: "type-1", description: "height 3" }),
  });

describe("updateExerciseNotesAction", () => {
  it("writes the trimmed exercise note only when it changed", () => {
    updateExerciseNotesAction(exercise(), { notes: "  good form  " });
    expect(zmutate.exercise.update).toHaveBeenCalledWith({
      id: "ex-1",
      notes: "good form",
    });
    expect(zmutate.exerciseType.update).not.toHaveBeenCalled();
  });

  it("writes only the type description for the type note", () => {
    updateExerciseNotesAction(exercise(), { typeNotes: "height 4 " });
    expect(zmutate.exerciseType.update).toHaveBeenCalledWith({
      id: "type-1",
      description: "height 4",
    });
    expect(zmutate.exercise.update).not.toHaveBeenCalled();
  });

  it("skips unchanged notes", () => {
    updateExerciseNotesAction(exercise(), { notes: "old", typeNotes: "height 3" });
    expect(zmutate.exercise.update).not.toHaveBeenCalled();
    expect(zmutate.exerciseType.update).not.toHaveBeenCalled();
  });

  it("clears a note with an empty string", () => {
    updateExerciseNotesAction(exercise(), { notes: "   ", typeNotes: "" });
    expect(zmutate.exercise.update).toHaveBeenCalledWith({ id: "ex-1", notes: "" });
    expect(zmutate.exerciseType.update).toHaveBeenCalledWith({
      id: "type-1",
      description: "",
    });
  });
});
