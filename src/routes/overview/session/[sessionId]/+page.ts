import { error } from "@sveltejs/kit";
import type { PageLoadEvent } from "./$types";

export async function load({ params }: PageLoadEvent) {
    if (!params.sessionId) {
        error(404, 'Session not found');
    }

    return {
        sessionId: params.sessionId,
    }
}
