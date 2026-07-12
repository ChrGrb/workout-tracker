import { describe, it, expect } from "vitest";
import { createTemplate } from "./create";
import { updateTemplate } from "./update";
import { deleteTemplate } from "./delete";
import { createFakeTx, runMutator } from "$lib/testing/fakeTx";

const ctx = { userID: "user-1" };

describe("createTemplate", () => {
  it("inserts the template and one join row per exercise type", async () => {
    const { tx, rows } = createFakeTx();
    await runMutator(createTemplate, {
      tx,
      ctx,
      args: { id: "tpl1", userId: "user-1", name: "Push", createdAt: 1, exerciseTypeIds: ["t1", "t2"] },
    });
    expect(rows("workoutSessionTemplate")).toEqual([
      { id: "tpl1", userId: "user-1", name: "Push", createdAt: 1 },
    ]);
    expect(rows("_exerciseTypeToWorkoutSessionTemplate")).toEqual([
      { A: "t1", B: "tpl1" },
      { A: "t2", B: "tpl1" },
    ]);
  });
});

describe("updateTemplate", () => {
  it("renames when a name is given", async () => {
    const { tx, rows } = createFakeTx({
      workoutSessionTemplate: [{ id: "tpl1", name: "Old" }],
    });
    await runMutator(updateTemplate, { tx, ctx, args: { id: "tpl1", name: "New" } });
    expect(rows("workoutSessionTemplate")[0]).toMatchObject({ name: "New" });
  });

  it("fully replaces the join rows when exerciseTypeIds is given", async () => {
    const { tx, rows } = createFakeTx({
      workoutSessionTemplate: [{ id: "tpl1", name: "Push" }],
      _exerciseTypeToWorkoutSessionTemplate: [
        { A: "t1", B: "tpl1" },
        { A: "t2", B: "tpl1" },
        { A: "t1", B: "tpl2" }, // belongs to another template — must be untouched
      ],
    });
    await runMutator(updateTemplate, { tx, ctx, args: { id: "tpl1", exerciseTypeIds: ["t3"] } });
    expect(rows("_exerciseTypeToWorkoutSessionTemplate")).toEqual([
      { A: "t1", B: "tpl2" },
      { A: "t3", B: "tpl1" },
    ]);
  });
});

describe("deleteTemplate", () => {
  it("removes the template and its join rows, leaving other templates' joins", async () => {
    const { tx, rows } = createFakeTx({
      workoutSessionTemplate: [{ id: "tpl1" }, { id: "tpl2" }],
      _exerciseTypeToWorkoutSessionTemplate: [
        { A: "t1", B: "tpl1" },
        { A: "t2", B: "tpl2" },
      ],
    });
    await runMutator(deleteTemplate, { tx, ctx, args: { id: "tpl1" } });
    expect(rows("workoutSessionTemplate")).toEqual([{ id: "tpl2" }]);
    expect(rows("_exerciseTypeToWorkoutSessionTemplate")).toEqual([{ A: "t2", B: "tpl2" }]);
  });
});
