import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("$lib/zero/outbox", () => ({
  zmutate: {
    session: { create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    exercise: { create: vi.fn().mockResolvedValue(undefined) },
  },
}));

import { zmutate } from "$lib/zero/outbox";
import createSessionFromTemplateAction from "./createSessionFromTemplateAction";
import finishSessionAction from "./finishSessionAction";
import deleteSessionAction from "./deleteSessionAction";
import updateSessionNameAction from "./updateSessionNameAction";
import type { WorkoutSessionTemplateWithExerciseTypes } from "$lib/utils/prismaTypes";

beforeEach(() => vi.clearAllMocks());

describe("createSessionFromTemplateAction", () => {
  it("creates a session named after the template and adds each exercise type", () => {
    const template = {
      id: "tpl1",
      name: "Push",
      userId: "user-1",
      createdAt: new Date(0),
      exerciseTypes: [{ id: "t1" }, { id: "t2" }],
    } as unknown as WorkoutSessionTemplateWithExerciseTypes;

    createSessionFromTemplateAction("user-1", template);

    expect(zmutate.session.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Push", userId: "user-1" }),
    );
    expect(zmutate.exercise.create).toHaveBeenCalledTimes(2);
    expect(zmutate.exercise.create).toHaveBeenCalledWith(
      expect.objectContaining({ typeId: "t1" }),
    );
    expect(zmutate.exercise.create).toHaveBeenCalledWith(
      expect.objectContaining({ typeId: "t2" }),
    );
  });
});

describe("thin session wrappers", () => {
  it("finishSessionAction marks the session finished", () => {
    finishSessionAction({ id: "s1" });
    expect(zmutate.session.update).toHaveBeenCalledWith({ id: "s1", finished: true });
  });

  it("deleteSessionAction deletes by id", () => {
    deleteSessionAction({ id: "s1" });
    expect(zmutate.session.delete).toHaveBeenCalledWith({ id: "s1" });
  });

  it("updateSessionNameAction renames the session", () => {
    updateSessionNameAction({ id: "s1", name: "Leg day" });
    expect(zmutate.session.update).toHaveBeenCalledWith({ id: "s1", name: "Leg day" });
  });
});
