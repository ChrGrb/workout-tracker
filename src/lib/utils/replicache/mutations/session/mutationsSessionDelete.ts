import type { WorkoutSession } from "@prisma/client"
import type { WriteTransaction } from "replicache"

// Mutations
const mutationsSessionDelete = async ({ tx, args }: { tx: WriteTransaction, args: WorkoutSession }) => {
    const key = `user/${args.userId}/session/${args.id}`;

    return await tx.del(key);
}

export default mutationsSessionDelete