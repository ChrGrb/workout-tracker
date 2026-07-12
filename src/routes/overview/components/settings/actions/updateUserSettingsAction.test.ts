import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("$lib/zero/outbox", () => ({
  zmutate: { settings: { update: vi.fn() } },
}));

import { zmutate } from "$lib/zero/outbox";
import updateUserSettingsAction from "./updateUserSettingsAction";
import type { Settings } from "@prisma/client";

beforeEach(() => vi.clearAllMocks());

describe("updateUserSettingsAction", () => {
  it("merges the updates over the existing settings", () => {
    const settings = {
      id: "set1",
      userId: "user-1",
      useTimer: false,
      timerValue: 180000,
    } as Settings;
    updateUserSettingsAction(settings, { useTimer: true });
    expect(zmutate.settings.update).toHaveBeenCalledWith({
      id: "set1",
      userId: "user-1",
      useTimer: true,
      timerValue: 180000,
    });
  });
});
