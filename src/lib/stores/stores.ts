import type { Settings } from "@prisma/client";
import { useWritable } from "./use-shared-store";
import { Replicache } from "replicache";
import { PUBLIC_REPLICACHE_LICENSE_KEY } from "$env/static/public";
import { mutators, type M } from "$lib/utils/replicache/mutations/mutations";
import type * as PusherPushNotifications from "@pusher/push-notifications-web";

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
  useWritable<Settings>("settings", {
    id: "",
    useTimer: false,
    timerValue: 180000,
    userId: "",
  } as Settings);
export const useExerciseTimers = () =>
  useWritable<Array<{ exerciseId: string; startTime: number }>>(
    "exerciseTimers",
    []
  );
export const useExerciseCooldownTimers = () =>
  useWritable<Array<{ exerciseId: string; startTime: number }>>(
    "exerciseCooldownTimers",
    []
  );
export const useUserId = () =>
  useWritable<string | undefined>("userId", undefined);
export const useScroll = () => useWritable<number>("scroll", 0);
export const useBeamsClient = () =>
  useWritable<PusherPushNotifications.Client | undefined>(
    "beamsClient",
    undefined
  );

export const useBackNavigation = () =>
  useWritable<boolean>("backNavigation", false);

export const useForwardNavigation = () =>
  useWritable<boolean>("forwardNavigation", false);
