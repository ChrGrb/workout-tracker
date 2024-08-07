import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient } from "@prisma/client";
import { error } from "@sveltejs/kit";

const prisma = new PrismaClient();

export async function DELETE({ params }: RequestEvent) {
    const setId = params.setId;

    let deletedSet = null;

    try {
        deletedSet = await prisma.exerciseSet.delete({
            where: { id: setId },
            select: {
                id: true,
            }
        });
    } catch (responseError) {
        error(400, (responseError as Error).message);
    }

    return json(deletedSet);
}