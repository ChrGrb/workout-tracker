import { PrismaClient } from "@prisma/client";
import { redis } from "../redis";
import { openai } from "./Client";


export async function getExerciseDescription(exerciseName: string): Promise<string> {
    const redisKey = exerciseName + "_description";
    const cached = await redis.get(redisKey);

    if (cached) {
        return JSON.parse(cached);
    }

    const chat_completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { "role": 'system', "content": "You are an informative personal trainer. You write multiple concise paragraphs about how to do the workout and what the workout trains. Separate paragraphs with double new lines" },
            { "role": "user", "content": "Write a short description for the workout " + exerciseName }
        ]
    });

    const exerciseDescription = chat_completion.data.choices[0].message?.content ?? "";

    redis.set(redisKey, JSON.stringify(exerciseDescription))

    return exerciseDescription;
}

export async function setExerciseTypeDescription(exerciseTypeId: string, exerciseDescription: Promise<string>) {
    const prisma = new PrismaClient();

    await prisma.exerciseType.update({
        where: {
            id: exerciseTypeId
        },
        data: {
            description: await exerciseDescription
        }
    });
}