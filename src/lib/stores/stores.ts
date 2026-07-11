import type { Settings } from "@prisma/client";
import type * as PusherPushNotifications from "@pusher/push-notifications-web";
import { persisted } from "svelte-persisted-store";
import { type AddExerciseSetSettings } from "$lib/types/addExerciseSetSettings";

export const useSettings = () =>
  persisted<Settings>("settings", {
    id: "",
    useTimer: false,
    timerValue: 180000,
    userId: "",
  } as Settings);
export const useExerciseTimers = () =>
  persisted<Array<{ exerciseId: string; startTime: number }>>(
    "exerciseTimers",
    []
  );
export const useExerciseCooldownTimers = () =>
  persisted<Array<{ exerciseId: string; startTime: number }>>(
    "exerciseCooldownTimers",
    []
  );
export const useUserId = () =>
  persisted<string | undefined>("userId", undefined);
export const useScroll = () => persisted<number>("scroll", 0);
export const useBeamsClient = () =>
  persisted<PusherPushNotifications.Client | undefined>(
    "beamsClient",
    undefined
  );

export const useBackNavigation = () =>
  persisted<boolean>("backNavigation", false);

export const useForwardNavigation = () =>
  persisted<boolean>("forwardNavigation", false);

export const useAddExerciseSetSettings = () =>
  persisted<AddExerciseSetSettings[]>("addExerciseSetSettings", []);
