import type { ExerciseAverage } from "$lib/types/exerciseAverage";
import type { ExerciseFull } from "../prismaTypes"
import { filterDeleted } from "./filterDeleted"

export const getRecommendations = (exercise: ExerciseFull, previousExercises: ExerciseFull[]): ExerciseAverage | null => {
    try {
        const previousRelevantExerciseSets = filterDeleted(filterDeleted(previousExercises).filter((previousExercise) => previousExercise.typeId === exercise.typeId).slice(-3).flatMap((previousExercise) => previousExercise.sets));

        if (!previousRelevantExerciseSets)
            return null;

        const averageWeights = previousRelevantExerciseSets.map((previousExercise) => previousExercise.weight).reduce((partialSum, weight) => partialSum + weight, 0) / previousRelevantExerciseSets.length;
        const averageReps = previousRelevantExerciseSets.map((previousExercise) => previousExercise.reps).reduce((partialSum, reps) => partialSum + reps, 0) / previousRelevantExerciseSets.length;

        return { averageWeight: averageWeights, averageReps: averageReps };
    } catch (error) {
        return null;
    }
}