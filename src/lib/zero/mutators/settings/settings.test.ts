import { describe, it, expect } from "vitest";
import { updateSettings } from "./update";
import { createFakeTx, runMutator } from "$lib/testing/fakeTx";

const ctx = { userID: "user-1" };

describe("updateSettings", () => {
  it("inserts settings when none exist (upsert)", async () => {
    const { tx, rows } = createFakeTx();
    await runMutator(updateSettings, {
      tx,
      ctx,
      args: { id: "set1", userId: "user-1", useTimer: true, timerValue: 120000 },
    });
    expect(rows("settings")).toEqual([
      { id: "set1", userId: "user-1", useTimer: true, timerValue: 120000 },
    ]);
  });

  it("updates existing settings (upsert)", async () => {
    const { tx, rows } = createFakeTx({
      settings: [{ id: "set1", userId: "user-1", useTimer: false, timerValue: 180000 }],
    });
    await runMutator(updateSettings, {
      tx,
      ctx,
      args: { id: "set1", userId: "user-1", useTimer: true, timerValue: 90000 },
    });
    expect(rows("settings")).toEqual([
      { id: "set1", userId: "user-1", useTimer: true, timerValue: 90000 },
    ]);
  });

  it("enforces ownership on the server", async () => {
    const { tx } = createFakeTx({}, "server");
    await expect(
      runMutator(updateSettings, {
        tx,
        ctx: { userID: "intruder" },
        args: { id: "set1", userId: "user-1", useTimer: true, timerValue: 1 },
      }),
    ).rejects.toThrow("Not authorized");
  });
});
