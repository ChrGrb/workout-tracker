import { m, type Tx } from "../shared";

export type UpdateEquipmentArgs = {
  id: string;
  name?: string;
};

export const updateEquipment = m(
  async ({ tx, args }: { tx: Tx; args: UpdateEquipmentArgs }) => {
    await tx.mutate.equipment.update({
      id: args.id,
      ...(args.name !== undefined ? { name: args.name } : {}),
    });
  },
);
