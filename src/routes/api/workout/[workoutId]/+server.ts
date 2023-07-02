import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET({ params }: RequestEvent) {
    const workoutId = Number(params.workoutId);

    const workout = await prisma.workout.findFirst({ where: { id: workoutId }, include: {
        sets: true,
    } });

    return json(workout);
}