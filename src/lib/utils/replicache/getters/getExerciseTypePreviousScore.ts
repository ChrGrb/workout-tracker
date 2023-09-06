import { getReplicache } from "$lib/stores/stores";
import calculateExerciseScore from "$lib/utils/data/calculateExerciseScore";
import type { ExerciseFull, WorkoutSessionFull } from "$lib/utils/prismaTypes";
import type { ExerciseType } from "@prisma/client";



const getExerciseTypePreviousScore = async (exerciseType: ExerciseType, userId: string) => {
    let sessions = (await getReplicache(userId).mutate.getSessions({ userId })).map((element) =>
        JSON.parse(element!.toString())
    ) as WorkoutSessionFull[];;

    let exercise = sessions
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .reduce((exerciseArray, session) => exerciseArray.concat(session.exercises), <ExerciseFull[]>[])
        .filter(exercise => exercise.type.id === exerciseType.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .at(1);

    if (!exercise)
        return null;

    return calculateExerciseScore(exercise);
}

export default getExerciseTypePreviousScore;

















