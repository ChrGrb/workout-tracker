import type {
  Exercise,
  ExerciseSet,
  ExerciseType,
  Settings,
  WorkoutSession,
} from "@prisma/client";
import type { ExerciseFull, WorkoutSessionFull } from "$lib/utils/prismaTypes";

// Deterministic-ish id helper. Tests that assert on ids should pass them
// explicitly; this is just for filler.
let seq = 0;
export const nextId = (prefix = "id") => `${prefix}-${++seq}`;
export const resetIds = () => {
  seq = 0;
};

export function makeExerciseSet(
  overrides: Partial<ExerciseSet> = {},
): ExerciseSet {
  return {
    id: nextId("set"),
    exerciseId: "ex-1",
    exerciseSetType: "WORKOUT",
    reps: 1,
    weight: 0,
    additionalWeight: 0,
    time: 0,
    notes: "",
    createdAt: new Date(0),
    ...overrides,
  } as ExerciseSet;
}

export function makeExerciseType(
  overrides: Partial<ExerciseType> = {},
): ExerciseType {
  return {
    id: nextId("type"),
    name: "Bench Press",
    category: "WEIGHT",
    area: "CHEST",
    description: null,
    ...overrides,
  } as ExerciseType;
}

export function makeExercise(overrides: Partial<Exercise> = {}): Exercise {
  return {
    id: nextId("ex"),
    userId: "user-1",
    averageWeight: null,
    averageReps: null,
    typeId: "type-1",
    sessionId: "session-1",
    createdAt: new Date(0),
    previousScore: null,
    score: 0,
    ...overrides,
  } as Exercise;
}

export function makeExerciseFull(
  overrides: Partial<ExerciseFull> = {},
): ExerciseFull {
  const base = makeExercise(overrides as Partial<Exercise>);
  return {
    ...base,
    type: (overrides.type as ExerciseType) ?? makeExerciseType({ id: base.typeId }),
    sets: (overrides.sets as ExerciseSet[]) ?? [],
  };
}

export function makeSession(
  overrides: Partial<WorkoutSession> = {},
): WorkoutSession {
  return {
    id: nextId("session"),
    userId: "user-1",
    finished: false,
    createdAt: new Date(0),
    name: "Session",
    ...overrides,
  } as WorkoutSession;
}

export function makeSessionFull(
  overrides: Partial<WorkoutSessionFull> = {},
): WorkoutSessionFull {
  const base = makeSession(overrides as Partial<WorkoutSession>);
  return { ...base, exercises: (overrides.exercises as ExerciseFull[]) ?? [] };
}

export function makeSettings(overrides: Partial<Settings> = {}): Settings {
  return {
    id: nextId("settings"),
    userId: "user-1",
    useTimer: false,
    timerValue: 180000,
    ...overrides,
  } as Settings;
}
