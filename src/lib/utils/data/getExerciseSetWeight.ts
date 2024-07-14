import type { ExerciseSet } from "@prisma/client";

export const getExerciseSetWeight = (exerciseSet: ExerciseSet) => {
  return exerciseSet.weight + exerciseSet.additionalWeight;
};

export const getExerciseSetScore = (exerciseSet: ExerciseSet) => {
  return (
    exerciseSet.weight ??
    0 + exerciseSet.additionalWeight ??
    0 + exerciseSet.time ??
    0
  );
};
