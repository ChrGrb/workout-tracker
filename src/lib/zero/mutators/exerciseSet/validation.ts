import type { UpdateExerciseSetArgs } from "./update";

// Shared bounds for exercise-set values. The client form schema reads these too,
// so the UI and the authoritative server check agree.
export const EXERCISE_SET_LIMITS = {
  maxReps: 10000,
  maxWeight: 2000,
  maxNotes: 2000,
} as const;

export const EXERCISE_SET_TYPES = ["WARMUP", "WORKOUT", "COOLDOWN"] as const;

const MAX_ID_LENGTH = 64;

function isValidWeight(value: unknown): boolean {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= EXERCISE_SET_LIMITS.maxWeight
  );
}

// Deterministic value validation for a (partial) set update. Runs on both the
// client and the server; args arrive untrusted on the server, so every check is
// strict on type and never coerces (no Number()/String()). Undefined fields are
// allowed — they are simply not written.
export function assertValidExerciseSetUpdate(args: UpdateExerciseSetArgs): void {
  const invalid = () => new Error("Invalid exercise set");

  if (typeof args !== "object" || args === null) throw invalid();

  const { id, exerciseSetType, reps, weight, additionalWeight, notes } =
    args as Record<keyof UpdateExerciseSetArgs, unknown>;

  if (typeof id !== "string" || id.length < 1 || id.length > MAX_ID_LENGTH) {
    throw invalid();
  }
  if (
    exerciseSetType !== undefined &&
    !(EXERCISE_SET_TYPES as readonly unknown[]).includes(exerciseSetType)
  ) {
    throw invalid();
  }
  if (
    reps !== undefined &&
    !(
      Number.isInteger(reps) &&
      (reps as number) >= 1 &&
      (reps as number) <= EXERCISE_SET_LIMITS.maxReps
    )
  ) {
    throw invalid();
  }
  if (weight !== undefined && !isValidWeight(weight)) throw invalid();
  if (additionalWeight !== undefined && !isValidWeight(additionalWeight)) {
    throw invalid();
  }
  if (
    notes !== undefined &&
    !(typeof notes === "string" && notes.length <= EXERCISE_SET_LIMITS.maxNotes)
  ) {
    throw invalid();
  }
}
