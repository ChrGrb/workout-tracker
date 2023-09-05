import type { Exercise, ExerciseType, Settings, WorkoutSession } from "@prisma/client";
import { useWritable } from "./use-shared-store";
import { Replicache, type WriteTransaction } from "replicache";
import { PUBLIC_REPLICACHE_LICENSE_KEY } from "$env/static/public";
import { mutators, type M } from "$lib/utils/replicache/mutations/mutations";



let replicachePromise: Replicache<M>;

const _createReplicache = (userId: string) => {
    const rep = new Replicache<M>({
        name: userId,
        licenseKey: "l6cdbef9e35ba4bbe9120a334bdaf4873",
        pullURL: "/api/replicache/pull?userId=" + userId,
        pushURL: "/api/replicache/push?userId=" + userId,
        mutators: mutators
    });

    replicachePromise = rep;

    return rep;
}


export const getReplicache = (name: string) => replicachePromise ? replicachePromise : _createReplicache(name);
export const getReplicacheAfterInit = () => replicachePromise;

export const useSettings = () => useWritable<Settings>('settings', { id: "", useTimer: false, timerValue: 180000, userId: "" } as Settings);
export const useExerciseTimers = () => useWritable<Array<{ exerciseId: string, startTime: number }>>('exerciseTimers', []);
export const useUserId = () => useWritable<string | undefined>('userId', undefined);