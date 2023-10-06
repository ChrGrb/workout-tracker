export const getOverviewPath = '/overview';
export const getExercisePath = ({ sessionId, exerciseId }: { sessionId: string, exerciseId: string }) => `${getOverviewPath}/session/${sessionId}/exercise/${exerciseId}`;
export const getAddExerciseSetPath = (args: { sessionId: string, exerciseId: string }) => `${getExercisePath(args)}/addSet`;
export const getAddExerciseTypePath = `${getOverviewPath}/addExerciseType`;
export const getAddExercisePath = ({ sessionId }: { sessionId: string }) => `${getOverviewPath}/session/${sessionId}/addExercise`;
export const getAddTemplatePath = `${getOverviewPath}/template/addWorkoutSessionTemplate`
