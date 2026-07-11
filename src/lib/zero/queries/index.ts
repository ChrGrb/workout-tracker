import { defineQueries } from "@rocicorp/zero";
import { me } from "./me";
import { sessions } from "./sessions";
import { sessionById } from "./sessionById";
import { exerciseTypes } from "./exerciseTypes";
import { templates } from "./templates";
import { previousExercisesOfType } from "./previousExercisesOfType";

// The synced-query registry. To add a query: create a file exporting a `q(...)`
// definition and wire it in here.
export const queries = defineQueries({
  me,
  sessions,
  sessionById,
  exerciseTypes,
  templates,
  previousExercisesOfType,
});

export type { QueryContext } from "./shared";
