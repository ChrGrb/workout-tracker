import type { ExerciseSet } from "@prisma/client";

export const getExerciseSetWeight = (exerciseSet: ExerciseSet) => {
    console.log(exerciseSet)
    return exerciseSet.weight + exerciseSet.additionalWeight;
}