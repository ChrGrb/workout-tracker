import type { ExerciseSet } from "@prisma/client";
import type { ExerciseFull, WorkoutSessionFull } from "$lib/utils/prismaTypes";
import { getExerciseSetWeight } from "./getExerciseSetWeight";

// Chronological order (oldest first), so the export reads like the workout was
// performed. (`sortByCreatedAt` sorts newest-first for the UI, hence a local one.)
const byCreatedAtAsc = <T extends { createdAt: Date }>(a: T, b: T) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

function formatSet(set: ExerciseSet): string {
  const weight = getExerciseSetWeight(set); // weight + additionalWeight
  let value: string;
  if (set.time > 0) {
    value = `${Math.round(set.time / 1000)} s`;
  } else if (weight > 0) {
    value = `${weight} kg × ${set.reps}`;
  } else {
    value = `${set.reps} reps`;
  }

  if (set.exerciseSetType !== "WORKOUT") {
    value += ` (${set.exerciseSetType.toLowerCase()})`;
  }

  const notes = set.notes?.trim();
  if (notes) value += ` — ${notes}`;

  return value;
}

function formatExercise(exercise: ExerciseFull): string {
  const equipment = exercise.type.equipment?.name;
  const heading = equipment
    ? `${exercise.type.name} (${equipment})`
    : exercise.type.name;

  const sets = [...(exercise.sets ?? [])].sort(byCreatedAtAsc);
  const lines =
    sets.length > 0 ? sets.map((s) => `- ${formatSet(s)}`) : ["- (no sets)"];

  return [heading, ...lines].join("\n");
}

/**
 * Renders a workout session as plain text suitable for pasting into another
 * app's AI importer (e.g. Bevel): the session name + date, then each exercise
 * (with its equipment in parentheses, no muscle group) and its sets.
 */
export function formatWorkoutForExport(session: WorkoutSessionFull): string {
  const date = new Date(session.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const body = [...(session.exercises ?? [])]
    .sort(byCreatedAtAsc)
    .map(formatExercise)
    .join("\n\n");

  return `${session.name} — ${date}\n\n${body}`.trimEnd();
}
