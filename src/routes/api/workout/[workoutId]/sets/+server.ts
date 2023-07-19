import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET({ params }: RequestEvent) {
    const workoutId = params.workoutId;

    const workoutSets = await prisma.workoutSet.findMany({ where: { workoutId: workoutId } });

    return json(workoutSets);
}