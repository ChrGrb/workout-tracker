import type { ExerciseFull } from "../prismaTypes";

export const getPreviousExercisesOfType = (previousExercises: ExerciseFull[], exercise: ExerciseFull) => {
    return previousExercises.filter(previousExercise => previousExercise.typeId === exercise.typeId).filter(previousExercise => new Date(previousExercise.createdAt).getTime() < new Date(exercise.createdAt).getTime());
}