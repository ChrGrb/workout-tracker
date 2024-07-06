import type { ExerciseFull } from "../prismaTypes";
import { filterDeleted } from "./filterDeleted";
import { getExerciseSetScore } from "./getExerciseSetWeight";

const calculateExerciseScore = (exercise: ExerciseFull) => {
  return filterDeleted(exercise.sets)
    .filter((set) => set.exerciseSetType === "WORKOUT")
    .reduce((acc, set) => getExerciseSetScore(set) * set.reps + acc, 0);
};

export default calculateExerciseScore;
