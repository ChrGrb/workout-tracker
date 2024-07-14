import type { WorkoutSession } from "@prisma/client";
import type { WriteTransaction } from "replicache";

// Mutations
const mutationsSessionUpdate = async ({
  tx,
  args,
}: {
  tx: WriteTransaction;
  args: WorkoutSession;
}) => {
  const key = `user/${args.userId}/session/${args.id}`;

  const previousSession = await tx.get(key);

  return await tx.set(
    key,
    JSON.stringify({
      ...JSON.parse(previousSession?.toString() ?? ""),
      ...args,
    })
  );
};

export default mutationsSessionUpdate;
