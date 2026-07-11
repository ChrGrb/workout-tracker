import { zmutate } from "$lib/zero/outbox";

const finishSessionAction = (session: { id: string }) => {
  zmutate.session.update({ id: session.id, finished: true });
};

export default finishSessionAction;
