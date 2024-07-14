import { getReplicache } from "$lib/stores/stores";
import calculateExerciseScore from "$lib/utils/data/calculateExerciseScore";
import { filterDeleted } from "$lib/utils/data/filterDeleted";
import { sortByCreatedAt } from "$lib/utils/data/sortByDate";
import type { ExerciseFull, WorkoutSessionFull } from "$lib/utils/prismaTypes";
import type { ExerciseType } from "@prisma/client";

const getExerciseTypePreviousScore = async (
  exerciseType: ExerciseType,
  userId: string,
  beforeDate: Date | null = null
) => {
  let sessions = filterDeleted(
    (await getReplicache(userId).mutate.getSessions({ userId })).map(
      (element) => JSON.parse(element!.toString())
    ) as WorkoutSessionFull[]
  );

  let exercises = filterDeleted(
    sessions
      .sort(sortByCreatedAt)
      .reduce(
        (exerciseArray, session) => exerciseArray.concat(session.exercises),
        <ExerciseFull[]>[]
      )
  )
    .filter((exercise) => exercise.type.id === exerciseType.id)
    .filter((exercise) => {
      return beforeDate
        ? new Date(exercise.createdAt).getTime() <
            new Date(beforeDate).getTime()
        : true;
    })
    .sort(sortByCreatedAt)
    .slice(0, 3)
    .map((exercise) => calculateExerciseScore(exercise));

  const exerciseScoreAverage =
    exercises.reduce((score, acc) => score + acc, 0) / exercises.length;

  return exerciseScoreAverage;
};

export default getExerciseTypePreviousScore;
