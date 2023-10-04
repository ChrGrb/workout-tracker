import type { WorkoutSession, Exercise, ExerciseType, ExerciseSet, Settings, User, WorkoutSessionTemplate } from "@prisma/client";

export type WorkoutSessionFull = WorkoutSession & { exercises: ExerciseFull[] };
export type ExerciseFull = Exercise & { type: ExerciseType, sets: ExerciseSet[] };
export type UserWithSettings = User & { settings: Settings };
export type WorkoutSessionTemplateWithExerciseTypes = WorkoutSessionTemplate & { exerciseTypes: ExerciseType[] };