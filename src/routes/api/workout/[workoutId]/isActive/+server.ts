import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient } from "@prisma/client";
import { error } from "@sveltejs/kit";

const prisma = new PrismaClient();

export async function GET({ params }: RequestEvent) {
    const workoutId = params.workoutId;

    const workout = await prisma.workout.findFirst({
        where: { id: workoutId }
    });

    if (workout) {
        const sessions = await prisma.workoutSession.findFirst({ where: { id: workout.sessionId }, });

        return json({ active: !sessions?.finished ?? false });
    }


    return json({ active: false });
}