import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { PrismaClient, type WorkoutSet } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST({ request, params }: RequestEvent) {
    const workoutId = Number(params.workoutId);
    const { workoutSet } = (await request.json()) as { workoutSet: WorkoutSet };

    try {
        await prisma.workout.update({
            where: {
                id: workoutId
            },
            data: {
                sets: {
                    create: workoutSet,
                }
            }
        });
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }
}