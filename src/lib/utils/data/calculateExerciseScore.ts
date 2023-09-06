import type { ExerciseFull } from "../prismaTypes";

const calculateExerciseScore = (exercise: ExerciseFull) => {
    return exercise.sets.reduce((acc, set) => (set.weight * set.reps) + acc, 0);
}

export default calculateExerciseScore;