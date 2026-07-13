import type { Settings } from "@prisma/client";
import type * as PusherPushNotifications from "@pusher/push-notifications-web";
import { persisted } from "svelte-persisted-store";
import { writable, type Writable } from "svelte/store";
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

// The Beams client is a live class instance with an open service-worker
// connection — it can't be JSON-serialized to localStorage, and two persisted
// instances in the same tab don't sync (the storage event is cross-tab only).
// Keep it in a module-level singleton so every caller (layout + settings) shares
// the one client created after the service worker is ready.
let beamsClientStore:
  | Writable<PusherPushNotifications.Client | undefined>
  | undefined;
export const useBeamsClient = () => {
  if (!beamsClientStore)
    beamsClientStore = writable<PusherPushNotifications.Client | undefined>(
      undefined
    );
  return beamsClientStore;
};

export const useBackNavigation = () =>
  persisted<boolean>("backNavigation", false);

export const useForwardNavigation = () =>
  persisted<boolean>("forwardNavigation", false);

export const useAddExerciseSetSettings = () =>
  persisted<AddExerciseSetSettings[]>("addExerciseSetSettings", []);
