import type { ExerciseFull } from "../prismaTypes";
import { filterDeleted } from "./filterDeleted";
import { getExerciseSetWeight } from "./getExerciseSetWeight";

const calculateExerciseScore = (exercise: ExerciseFull) => {
    return filterDeleted(exercise.sets).filter(set => set.exerciseSetType === "WORKOUT").reduce((acc, set) => (getExerciseSetWeight(set) * set.reps) + acc, 0);
}

export default calculateExerciseScore;