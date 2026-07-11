import { zmutate } from "$lib/zero/outbox";
import type { Settings } from "@prisma/client";

const updateUserSettingsAction = (
  settings: Settings,
  updates: Partial<Settings>,
) => {
  const merged = { ...settings, ...updates };
  zmutate.settings.update({
    id: merged.id,
    userId: merged.userId,
    useTimer: merged.useTimer,
    timerValue: merged.timerValue,
  });
};

export default updateUserSettingsAction;
