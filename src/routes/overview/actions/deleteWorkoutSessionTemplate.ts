import { zmutate } from "$lib/zero/outbox";
import type { WorkoutSessionTemplate } from "@prisma/client";

const deleteWorkoutSessionTemplateAction = (
  workoutSessionTemplate: WorkoutSessionTemplate,
) => {
  zmutate.template.delete({ id: workoutSessionTemplate.id });
};

export default deleteWorkoutSessionTemplateAction;
