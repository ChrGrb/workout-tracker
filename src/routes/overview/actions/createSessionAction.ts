import { getReplicacheAfterInit } from "$lib/stores/stores";
import generateId from "$lib/utils/generateId";
import type { WorkoutSession } from "@prisma/client";

const createSessionAction = (userId: string) => {
    getReplicacheAfterInit().mutate.createSession({
        id: generateId(),
        versionUpdatedAt: null,
        name: "Session",
        userId: userId,
        exercises: [],
        finished: false,
        createdAt: new Date(),
        isDeleted: false,
    } as WorkoutSession);
};

export default createSessionAction;