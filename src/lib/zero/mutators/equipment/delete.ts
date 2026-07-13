import { m, assertOwner, type Tx, type ZeroAuthData } from "../shared";
import { zql } from "../../schema";

export const deleteEquipment = m(
  async ({
    tx,
    args,
    ctx,
  }: {
    tx: Tx;
    args: { id: string; userId: string };
    ctx: ZeroAuthData;
  }) => {
    assertOwner(tx, ctx, args.userId);
    // Clear the FK from any exercise types that reference this equipment first
    // (the Postgres FK is RESTRICT), then hard-delete the equipment.
    const referencing = await tx.run(
      zql.exerciseType.where("equipmentId", args.id),
    );
    for (const type of referencing) {
      await tx.mutate.exerciseType.update({ id: type.id, equipmentId: null });
    }
    await tx.mutate.equipment.delete({ id: args.id });
  },
);
