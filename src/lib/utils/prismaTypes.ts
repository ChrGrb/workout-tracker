import type { WorkoutSession, Exercise, ExerciseType, ExerciseSet, Settings, User, WorkoutSessionTemplate, Equipment } from "@prisma/client";

export type ExerciseTypeWithEquipment = ExerciseType & { equipment: Equipment | null };
export type WorkoutSessionFull = WorkoutSession & { exercises: ExerciseFull[] };
export type ExerciseFull = Exercise & { type: ExerciseTypeWithEquipment, sets: ExerciseSet[] };
export type UserWithSettings = User & { settings: Settings };
export type WorkoutSessionTemplateWithExerciseTypes = WorkoutSessionTemplate & { exerciseTypes: ExerciseType[] };