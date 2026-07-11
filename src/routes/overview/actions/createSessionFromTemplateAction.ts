import { zmutate } from "$lib/zero/outbox";
import generateId from "$lib/utils/generateId";
import type { WorkoutSessionTemplateWithExerciseTypes } from "$lib/utils/prismaTypes";
import addExerciseAction from "../session/[sessionId]/addExercise/actions/addExerciseAction";

const createSessionFromTemplateAction = (
  userId: string,
  template: WorkoutSessionTemplateWithExerciseTypes,
) => {
  const sessionId = generateId();

  zmutate.session.create({
    id: sessionId,
    name: template.name,
    userId,
    createdAt: Date.now(),
  });

  template.exerciseTypes.forEach((exerciseType) =>
    addExerciseAction(exerciseType, userId, sessionId),
  );
};

export default createSessionFromTemplateAction;
