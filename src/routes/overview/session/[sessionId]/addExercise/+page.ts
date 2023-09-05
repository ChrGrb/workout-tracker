import type { PageLoadEvent } from "./$types";

export async function load({ params }: PageLoadEvent) {
    return {
        sessionId: params.sessionId,
    }
}