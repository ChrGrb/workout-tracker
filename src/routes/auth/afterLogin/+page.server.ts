import type { PageServerLoadEvent } from "./$types";

export async function load({ cookies }: PageServerLoadEvent) {
    let userId = (await cookies.get('userId') ?? '');

    return {
        userId: userId,
    };
}