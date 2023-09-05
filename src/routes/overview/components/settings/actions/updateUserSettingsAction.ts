import { getReplicacheAfterInit } from "$lib/stores/stores";
import type { Settings } from "@prisma/client";

const updateUserSettingsAction = (settings: Settings, updates: Partial<Settings>) => {
    getReplicacheAfterInit().mutate.updateUserSettings({ ...settings, ...updates });
};

export default updateUserSettingsAction;