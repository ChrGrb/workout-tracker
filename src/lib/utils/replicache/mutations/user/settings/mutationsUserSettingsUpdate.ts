import type { UserWithSettings } from "$lib/utils/prismaTypes";
import type { Settings } from "@prisma/client"
import type { WriteTransaction } from "replicache"

// Mutations
const mutationsUserSettingsUpdate = async ({ tx, args }: { tx: WriteTransaction, args: Settings }) => {
    const key = `user/${args.userId}/user`

    const user = JSON.parse((await tx.get(key) ?? '').toString()) as UserWithSettings;
    user.settings = { ...user.settings, ...args };

    return await tx.put(key, JSON.stringify({ ...user }))
}

export default mutationsUserSettingsUpdate