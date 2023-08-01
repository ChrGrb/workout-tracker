import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET({ params }: RequestEvent) {
    const exerciseId = params.exerciseId;

    const exerciseSets = await prisma.exerciseSet.findMany({ where: { exerciseId: exerciseId }, orderBy: { exerciseSetType: 'asc' } });

    return json(exerciseSets);
}