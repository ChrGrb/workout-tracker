import { error } from "@sveltejs/kit";
import type { RequestEvent } from "../$types";
import { PrismaClient } from '@prisma/client';
import { json } from "@sveltejs/kit";

const prisma = new PrismaClient();

export async function PUT({ params, request }: RequestEvent) {
    const userId = params.userId;
    const { enabled, duration } = (await request.json()) as { enabled: string, duration: string };

    let updatedTimerSettings = null;

    try {
        updatedTimerSettings = await prisma.user.update({
            where: { id: userId },
            data: {
                settings: {
                    update: {
                        useTimer: enabled == "true",
                        timerValue: +duration * 1000,
                    }
                }
            },
            select: {
                id: true,
            }
        });
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }

    return json(updatedTimerSettings);
}