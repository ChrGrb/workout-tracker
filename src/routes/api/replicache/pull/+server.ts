import { Prisma, PrismaClient } from "@prisma/client";
import type { RequestEvent } from "./$types";
import type { PullResponse } from "replicache";
import { error, json } from "@sveltejs/kit";
import utilsApiVersionGet from "$lib/utils/api/replicache/space/versionGet";
import utilsApiLastMutationIdGet from "$lib/utils/api/replicache/client/lastMutationIdGet";
import utilsApiEntriesGet from "$lib/utils/api/replicache/entries/entriesGet";

const prisma = new PrismaClient();



export async function POST({ request, url }: RequestEvent) {
    const requestBody = await request.json();
    const userId = url.searchParams.get('userId');

    if (!userId) return json({});

    // Provided by Replicache
    const { profileID, clientGroupID, cookie } = requestBody;

    if (!profileID || cookie === undefined)
        return error(401, "Not authenticated");

    try {
        const { lastMutationIdChanges, versionAt, patch } = await prisma.$transaction(
            async tx => {
                // #1. Get `version` for space
                const { data: version } = await utilsApiVersionGet({ tx, userId });


                // #2. Get last mutation Id changes for the current replicache client group
                let { data: mutationIdChanges } = await utilsApiLastMutationIdGet({
                    userId: userId,
                    cookie: cookie ?? 0,
                    tx
                });

                // #3. Get all transactions done after the last client request for the current space
                const { data: patch } = await utilsApiEntriesGet({
                    tx,
                    userId,
                    versionAt: cookie
                });

                return { lastMutationIdChanges: mutationIdChanges, versionAt: version, patch };
            },
            {
                isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Required for Replicache to work
                maxWait: 5000, // default: 2000
                timeout: 10000 // default: 5000
            }
        )

        const response: PullResponse = { lastMutationIDChanges: lastMutationIdChanges, cookie: versionAt, patch }

        // #5. Return object to client
        return json(response);
    } catch (err) {
        console.error(err);

        return error(401, err as Error);
    }
}