import { m, type Tx } from "../shared";

export type UpdateSessionArgs = {
  id: string;
  name?: string;
  finished?: boolean;
};

export const updateSession = m(
  async ({ tx, args }: { tx: Tx; args: UpdateSessionArgs }) => {
    await tx.mutate.workoutSession.update({
      id: args.id,
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.finished !== undefined ? { finished: args.finished } : {}),
    });
  },
);
