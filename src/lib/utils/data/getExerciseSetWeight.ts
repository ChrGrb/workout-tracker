import type { ExerciseSet } from "@prisma/client";

export const getExerciseSetWeight = (exerciseSet: ExerciseSet) => {
  return exerciseSet.weight + exerciseSet.additionalWeight;
};

export const getExerciseSetScore = (exerciseSet: ExerciseSet) => {
  return exerciseSet.weight + exerciseSet.additionalWeight + exerciseSet.time;
};
