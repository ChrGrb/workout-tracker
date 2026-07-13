import { describe, it, expect } from "vitest";
import { createEquipment } from "./create";
import { updateEquipment } from "./update";
import { deleteEquipment } from "./delete";
import { createFakeTx, runMutator } from "$lib/testing/fakeTx";

const ctx = { userID: "user-1" };

describe("createEquipment", () => {
  it("inserts the equipment", async () => {
    const { tx, rows } = createFakeTx();
    await runMutator(createEquipment, {
      tx,
      ctx,
      args: { id: "eq1", userId: "user-1", name: "Leg Press", createdAt: 1000 },
    });
    expect(rows("equipment")).toEqual([
      { id: "eq1", userId: "user-1", name: "Leg Press", createdAt: 1000 },
    ]);
  });

  it("enforces ownership on the server", async () => {
    const { tx } = createFakeTx({}, "server");
    await expect(
      runMutator(createEquipment, {
        tx,
        ctx: { userID: "intruder" },
        args: { id: "eq1", userId: "user-1", name: "Leg Press", createdAt: 1000 },
      }),
    ).rejects.toThrow("Not authorized");
  });
});

describe("updateEquipment", () => {
  it("renames the equipment", async () => {
    const { tx, rows } = createFakeTx({
      equipment: [{ id: "eq1", userId: "user-1", name: "Old", createdAt: 1000 }],
    });
    await runMutator(updateEquipment, { tx, ctx, args: { id: "eq1", name: "New" } });
    expect(rows("equipment")[0]).toMatchObject({ name: "New" });
  });
});

describe("deleteEquipment", () => {
  it("clears the FK from referencing types, then hard-deletes", async () => {
    const { tx, rows } = createFakeTx({
      equipment: [{ id: "eq1", userId: "user-1", name: "Leg Press", createdAt: 1000 }],
      exerciseType: [
        { id: "ty1", equipmentId: "eq1" },
        { id: "ty2", equipmentId: null },
      ],
    });
    await runMutator(deleteEquipment, {
      tx,
      ctx,
      args: { id: "eq1", userId: "user-1" },
    });
    expect(rows("equipment")).toEqual([]);
    const types = rows("exerciseType") as Array<{
      id: string;
      equipmentId: string | null;
    }>;
    expect(types.find((t) => t.id === "ty1")?.equipmentId).toBeNull();
  });

  it("enforces ownership on the server", async () => {
    const { tx } = createFakeTx(
      { equipment: [{ id: "eq1", userId: "user-1", name: "x", createdAt: 1 }] },
      "server",
    );
    await expect(
      runMutator(deleteEquipment, {
        tx,
        ctx: { userID: "intruder" },
        args: { id: "eq1", userId: "user-1" },
      }),
    ).rejects.toThrow("Not authorized");
  });
});
