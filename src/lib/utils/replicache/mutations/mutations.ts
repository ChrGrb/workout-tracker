import type { ExerciseSet, ExerciseType, Settings, WorkoutSession } from "@prisma/client";
import type { ReadTransaction, WriteTransaction } from "replicache";
import mutationsExerciseCreate from "./exercise/mutationsExerciseCreate";
import mutationsSessionCreate from "./session/mutationsSessionCreate";
import mutationsSessionUpdate from "./session/mutationsSessionUpdate";
import mutationsSessionDelete from "./session/mutationsSessionDelete";
import type { ExerciseFull } from "$lib/utils/prismaTypes";
import mutationsExerciseSetCreate from "./exerciseSet/mutationsExerciseSetCreate";
import mutationsExerciseDelete from "./exercise/mutationsExerciseDelete";
import mutationsExerciseSetDelete from "./exerciseSet/mutationsExerciseSetDelete";
import mutationsUserSettingsUpdate from "./user/settings/mutationsUserSettingsUpdate";
import mutationsExerciseTypeCreate from "./exerciseType/mutationsExerciseTypeCreate";
import mutationsExerciseTypeDelete from "./exerciseType/mutationsExerciseTypeDelete";
import mutationsSessionsGet from "./session/mutationsSessionsGet";

export type M = typeof mutators;

export const mutators = {
    createExercise: (tx: WriteTransaction, args: ExerciseFull) => mutationsExerciseCreate({ tx, args }),
    deleteExercise: (tx: WriteTransaction, args: ExerciseFull) => mutationsExerciseDelete({ tx, args }),
    createExerciseSet: (tx: WriteTransaction, args: { exercise: ExerciseFull, exerciseSet: ExerciseSet }) => mutationsExerciseSetCreate({ tx, args }),
    deleteExerciseSet: (tx: WriteTransaction, args: { exercise: ExerciseFull, exerciseSet: ExerciseSet }) => mutationsExerciseSetDelete({ tx, args }),
    createSession: (tx: WriteTransaction, args: WorkoutSession) => mutationsSessionCreate({ tx, args }),
    updateSession: (tx: WriteTransaction, args: WorkoutSession) => mutationsSessionUpdate({ tx, args }),
    deleteSession: (tx: WriteTransaction, args: WorkoutSession) => mutationsSessionDelete({ tx, args }),
    getSessions: (tx: ReadTransaction, args: { userId: string }) => mutationsSessionsGet({ tx, args }),
    updateUserSettings: (tx: WriteTransaction, args: Settings) => mutationsUserSettingsUpdate({ tx, args }),
    createExerciseType: (tx: WriteTransaction, args: { exerciseType: ExerciseType, userId: string }) => mutationsExerciseTypeCreate({ tx, args }),
    deleteExerciseType: (tx: WriteTransaction, args: { exerciseType: ExerciseType, userId: string }) => mutationsExerciseTypeDelete({ tx, args }),
}