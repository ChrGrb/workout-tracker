import { m, assertOwner, type Tx, type ZeroAuthData } from "../shared";

export type CreateEquipmentArgs = {
  id: string;
  userId: string;
  name: string;
  createdAt: number;
};

export const createEquipment = m(
  async ({
    tx,
    args,
    ctx,
  }: {
    tx: Tx;
    args: CreateEquipmentArgs;
    ctx: ZeroAuthData;
  }) => {
    assertOwner(tx, ctx, args.userId);
    await tx.mutate.equipment.insert({
      id: args.id,
      userId: args.userId,
      name: args.name,
      createdAt: args.createdAt,
    });
  },
);
