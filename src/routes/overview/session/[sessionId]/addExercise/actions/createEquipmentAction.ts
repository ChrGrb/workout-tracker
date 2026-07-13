import { zmutate } from "$lib/zero/outbox";
import generateId from "$lib/utils/generateId";

// Creates a piece of equipment and returns its generated id so the caller can
// immediately select it.
const createEquipmentAction = (userId: string, name: string): string => {
  const id = generateId();
  zmutate.equipment.create({ id, userId, name, createdAt: Date.now() });
  return id;
};

export default createEquipmentAction;
