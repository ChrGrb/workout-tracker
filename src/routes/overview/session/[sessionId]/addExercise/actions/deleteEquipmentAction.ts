import { zmutate } from "$lib/zero/outbox";

const deleteEquipmentAction = (userId: string, id: string) => {
  zmutate.equipment.delete({ id, userId });
};

export default deleteEquipmentAction;
