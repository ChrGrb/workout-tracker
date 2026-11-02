import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("$lib/zero/outbox", () => ({
  zmutate: {
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
    type: makeExerciseType({ id: "type-1", description: "height 3" }),
  });

describe("updateExerciseNotesAction", () => {
  it("writes the trimmed type note", () => {
    updateExerciseNotesAction(exercise(), { typeNotes: "height 4 " });
    expect(zmutate.exerciseType.update).toHaveBeenCalledWith({
      id: "type-1",
      description: "height 4",
    });
  });

  it("skips an unchanged note", () => {
    updateExerciseNotesAction(exercise(), { typeNotes: " height 3" });
    expect(zmutate.exerciseType.update).not.toHaveBeenCalled();
  });

  it("clears the note with an empty string", () => {
    updateExerciseNotesAction(exercise(), { typeNotes: "   " });
    expect(zmutate.exerciseType.update).toHaveBeenCalledWith({
      id: "type-1",
      description: "",
    });
  });
});
