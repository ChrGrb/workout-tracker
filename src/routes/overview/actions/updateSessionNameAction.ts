import { zmutate } from "$lib/zero/outbox";

const updateSessionNameAction = (session: { id: string; name: string }) => {
  zmutate.session.update({ id: session.id, name: session.name });
};

export default updateSessionNameAction;
