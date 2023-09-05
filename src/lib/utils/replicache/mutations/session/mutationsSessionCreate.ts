import type { WorkoutSession } from "@prisma/client"
import type { WriteTransaction } from "replicache"

// Mutations
const mutationSessionCreate = async ({ tx, args }: { tx: WriteTransaction, args: WorkoutSession }) => {
    const key = `user/${args.userId}/session/${args.id}`

    if (await tx.has(key)) throw new Error('Session already exists')

    return await tx.put(key, JSON.stringify({ ...args }))
}

export default mutationSessionCreate