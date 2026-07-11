import { getZ } from "./z.svelte";
import { queries } from "./queries";
import calculateExerciseScore from "$lib/utils/data/calculateExerciseScore";
import { sortByCreatedAt } from "$lib/utils/data/sortByDate";
import type { ExerciseFull } from "$lib/utils/prismaTypes";
import type { ExerciseType } from "@prisma/client";

// Average score of the up-to-3 most recent exercises of a given type before a date.
// Replaces the old Replicache getSessions read-mutator + client scan with a single
// user-scoped Zero query.
const getExerciseTypePreviousScore = async (
  exerciseType: ExerciseType,
  _userId: string,
  beforeDate: Date | number | null = null,
) => {
  const rows = (await getZ().run(
    queries.previousExercisesOfType({ typeId: exerciseType.id }),
  )) as unknown as ExerciseFull[];

  const scores = rows
    .filter((exercise) =>
      beforeDate
        ? new Date(exercise.createdAt).getTime() <
          new Date(beforeDate).getTime()
        : true,
    )
    .sort(sortByCreatedAt)
    .slice(0, 3)
    .map((exercise) => calculateExerciseScore(exercise));

  return scores.reduce((score, acc) => score + acc, 0) / scores.length;
};

export default getExerciseTypePreviousScore;
