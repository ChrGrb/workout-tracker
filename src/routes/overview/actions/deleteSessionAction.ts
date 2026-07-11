import { zmutate } from "$lib/zero/outbox";

const deleteSessionAction = (session: { id: string }) => {
  zmutate.session.delete({ id: session.id });
};

export default deleteSessionAction;
