import type { ReadTransaction } from "replicache";

const mutationsSessionsGet = async ({ tx, args }: { tx: ReadTransaction, args: { userId: string } }) =>
    await tx
        .scan({ prefix: `user/${args.userId}/session` })
        .values()
        .toArray();

export default mutationsSessionsGet;
