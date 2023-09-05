import { getReplicacheAfterInit } from "$lib/stores/stores";
import type { WorkoutSession } from "@prisma/client";

const finishSessionAction = (session: WorkoutSession) => {
    getReplicacheAfterInit().mutate.updateSession({
        ...session,
        finished: true,
    } as WorkoutSession);
};

export default finishSessionAction;