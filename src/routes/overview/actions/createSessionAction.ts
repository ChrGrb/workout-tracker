import { zmutate } from "$lib/zero/outbox";
import generateId from "$lib/utils/generateId";

const createSessionAction = (userId: string) => {
  zmutate.session.create({
    id: generateId(),
    name: "Session",
    userId,
    createdAt: Date.now(),
  });
};

export default createSessionAction;
