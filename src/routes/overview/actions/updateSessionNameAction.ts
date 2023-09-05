import { getReplicacheAfterInit } from "$lib/stores/stores";
import type { WorkoutSession } from "@prisma/client";

const updateSessionNameAction = (session: WorkoutSession) => {
    getReplicacheAfterInit().mutate.updateSession({
        ...session,
    } as WorkoutSession);
};

export default updateSessionNameAction;