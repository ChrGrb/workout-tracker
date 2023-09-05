import type { LoadEvent } from "@sveltejs/kit";
//export const prerender = true;

export const load = async ({ parent }: LoadEvent) => {
    const { userId } = await parent();

    return {
        userId: userId
    };
};