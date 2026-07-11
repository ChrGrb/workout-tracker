import type { ExerciseTypeArea } from "@prisma/client";
import type { ExerciseFull } from "../prismaTypes";

export const getAreaScoresFromExercises = (exercises: ExerciseFull[]) => {
  return exercises.reduce(
    (acc, exercise) => {
      const exerciseScore = exercise.sets.reduce((totalScore, set) => {
        if (set.reps === null) {
          return totalScore;
        }
        return (
          totalScore + set.reps * (set.weight + set.additionalWeight) + set.time
        );
      }, 0);

      const area = exercise.type.area;

      if (area && acc[area]) {
        acc[area] += exerciseScore;
      } else if (area) {
        acc[area] = exerciseScore;
      }

      return acc;
    },
    {} as Record<ExerciseTypeArea, number>,
  );
};
