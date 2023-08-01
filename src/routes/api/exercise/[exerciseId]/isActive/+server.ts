import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET({ params }: RequestEvent) {
    const exerciseId = params.exerciseId;

    const exercise = await prisma.exercise.findFirst({
        where: { id: exerciseId }
    });

    if (exercise) {
        const sessions = await prisma.workoutSession.findFirst({ where: { id: exercise.sessionId }, });

        return json({ active: !sessions?.finished ?? false });
    }


    return json({ active: false });
}