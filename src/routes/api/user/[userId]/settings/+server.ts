import { PrismaClient } from "@prisma/client";
import { type RequestEvent, error, json } from "@sveltejs/kit";

const prisma = new PrismaClient();

export async function POST({ params }: RequestEvent) {
    const userId = params.userId;

    try {
        const user = (await prisma.user.findFirst({
            where: {
                id: userId
            },
            include: {
                settings: true
            }
        }));

        if (user && !user.settings) {
            const updatedUser = (await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    settings: {}
                },
                select: {
                    settings: true,
                    id: true
                }
            }));
        }
    } catch (responseError) {
        throw error(400, (responseError as Error).message);
    }

    return json("");
}