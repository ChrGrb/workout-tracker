import type { Settings } from "@prisma/client";
import { Replicache } from "replicache";
import { PUBLIC_REPLICACHE_LICENSE_KEY } from "$env/static/public";
import { mutators, type M } from "$lib/utils/replicache/mutations/mutations";
import type * as PusherPushNotifications from "@pusher/push-notifications-web";
import { persisted } from "svelte-persisted-store";

let replicachePromise: Replicache<M>;

const _createReplicache = (userId: string) => {
  const rep = new Replicache<M>({
    name: userId,
    licenseKey: PUBLIC_REPLICACHE_LICENSE_KEY,
    pullURL: "/api/replicache/pull?userId=" + userId,
    pushURL: "/api/replicache/push?userId=" + userId,
    mutators: mutators,
  });

  replicachePromise = rep;

  return rep;
};

export const getReplicache = (name: string) =>
  replicachePromise ? replicachePromise : _createReplicache(name);
export const getReplicacheAfterInit = () => replicachePromise;

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
