import { openai } from "./Client";


export async function getExerciseDescription(exerciseName: string): Promise<string> {
    const chat_completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { "role": 'system', "content": "You are an informative personal trainer. You write multiple concise paragraphs about how to do the workout and what the workout trains. Separate paragraphs with double new lines" },
            { "role": "user", "content": "Write a short description for the workout " + exerciseName }
        ]
    });

    return chat_completion.data.choices[0].message?.content ?? "";
}