import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET({ params }: RequestEvent) {
    const workoutTypeId = Number(params.workoutTypeId);

    const workoutType = await prisma.workoutType.findFirst({
        where: { id: workoutTypeId }
    });

    return json(workoutType);
}