import type { Settings } from "@prisma/client";
import { useWritable } from "./use-shared-store";


export const useSettings = () => useWritable<Settings>('settings', { id: "", useTimer: false, timerValue: 180000, userId: "" });
export const useExerciseTimers = () => useWritable<Array<{ exerciseId: string, startTime: number }>>('exerciseTimers', []);