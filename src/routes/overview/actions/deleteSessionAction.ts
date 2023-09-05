import { getReplicacheAfterInit } from "$lib/stores/stores";
import type { WorkoutSessionFull } from "$lib/utils/prismaTypes";
import type { WorkoutSession } from "@prisma/client";

const deleteSessionAction = (session: WorkoutSessionFull) => {
    getReplicacheAfterInit().mutate.deleteSession({
        ...session,
        isDeleted: true,
    } as WorkoutSession);
};

export default deleteSessionAction;