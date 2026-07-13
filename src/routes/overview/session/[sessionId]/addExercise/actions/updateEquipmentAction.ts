import { zmutate } from "$lib/zero/outbox";

const updateEquipmentAction = (id: string, name: string) => {
  zmutate.equipment.update({ id, name });
};

export default updateEquipmentAction;
