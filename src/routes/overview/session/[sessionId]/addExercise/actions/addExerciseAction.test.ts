import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("$lib/zero/outbox", () => ({
  zmutate: { exercise: { create: vi.fn().mockResolvedValue(undefined) } },
}));

import { zmutate } from "$lib/zero/outbox";
import addExerciseAction from "./addExerciseAction";
import type { ExerciseType } from "@prisma/client";

beforeEach(() => vi.clearAllMocks());

describe("addExerciseAction", () => {
  it("creates an exercise for the type and returns the generated id", async () => {
    const type = { id: "ty1" } as unknown as ExerciseType;
    const id = await addExerciseAction(type, "user-1", "s1");
    expect(typeof id).toBe("string");
    expect(zmutate.exercise.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id,
        userId: "user-1",
        typeId: "ty1",
        sessionId: "s1",
        createdAt: expect.any(Number),
      }),
    );
  });
});
