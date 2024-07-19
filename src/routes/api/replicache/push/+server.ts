import { Prisma, PrismaClient } from "@prisma/client";
import type { RequestEvent } from "./$types";
import { json } from "@sveltejs/kit";
import { z } from "zod";
import utilsApiVersionGet from "$lib/utils/api/replicache/space/versionGet";
import utilsApiVersionSave from "$lib/utils/api/replicache/space/versionSave";
import utilsApiMutations from "$lib/utils/api/replicache/mutations/mutations";
import { error } from "@sveltejs/kit";
import utilsApiPokeSend from "$lib/utils/api/replicache/poke/send";

const prisma = new PrismaClient();



const mutationSchema = z.object({
    id: z.number(),
    clientID: z.string(),
    name: z.string(),
    args: z.any(),
});

const pushRequestSchema = z.object({
    clientGroupID: z.string(),
    mutations: z.array(mutationSchema),
});



export async function POST({ request, url }: RequestEvent) {
    const requestBody = await request.json();
    const userId = url.searchParams.get('userId') ?? "";

    const push = pushRequestSchema.parse(requestBody);

    if (!userId)
        error(401, "Not authenticated");

    // Provided by Replicache
    const { clientGroupID, mutations } = push;

    if (!clientGroupID || !mutations)
        error(401, "No clientID");

    try {
        const { data: versionLatest } = await prisma.$transaction(
            async tx => {
                // #1. Get next `version` for space
                const { data: version } = await utilsApiVersionGet({ tx, userId })

                const versionNext = version + 1

                // #2. Iterate mutations, increase mutation Id on each iteration, but use next version for comparison
                await utilsApiMutations({
                    replicacheClientGroupId: clientGroupID,
                    mutations,
                    userId,
                    tx,
                    versionNext: versionNext
                });

                // #3. Update the mutation version for the space
                const { data: versionUpdated } = await utilsApiVersionSave({
                    tx,
                    userId,
                    versionAt: versionNext
                })

                return { data: versionUpdated?.versionAt }
            },
            {
                isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Required for Replicache to work
                maxWait: 5000, // default: 2000 
                timeout: 10000 // default: 5000
            }
        );

        // #6. Poke client(s) to send a pull.
        await utilsApiPokeSend(userId);

        return json({});
    } catch (err) {
        console.error(err)

        error(401, err as Error);
    }
}