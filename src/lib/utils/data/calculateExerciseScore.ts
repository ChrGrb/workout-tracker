import type { ExerciseFull } from "../prismaTypes";
import { filterDeleted } from "./filterDeleted";

const calculateExerciseScore = (exercise: ExerciseFull) => {
    return filterDeleted(exercise.sets).filter(set => set.exerciseSetType === "WORKOUT").reduce((acc, set) => (set.weight * set.reps) + acc, 0);
}

export default calculateExerciseScore;