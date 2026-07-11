import { m, assertOwner, type Tx, type ZeroAuthData } from "../shared";

export type UpdateSettingsArgs = {
  id: string;
  userId: string;
  useTimer: boolean;
  timerValue: number;
};

export const updateSettings = m(
  async ({
    tx,
    args,
    ctx,
  }: {
    tx: Tx;
    args: UpdateSettingsArgs;
    ctx: ZeroAuthData;
  }) => {
    assertOwner(tx, ctx, args.userId);
    await tx.mutate.settings.upsert({
      id: args.id,
      userId: args.userId,
      useTimer: args.useTimer,
      timerValue: args.timerValue,
    });
  },
);
