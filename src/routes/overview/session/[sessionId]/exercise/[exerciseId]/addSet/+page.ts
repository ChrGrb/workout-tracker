import { error } from "@sveltejs/kit";
import type { PageLoadEvent } from "./$types";
import { getCallbackFromQuery } from "$lib/utils/routing/callbacks";

export async function load({ params, url }: PageLoadEvent) {
    if (!params.exerciseId) {
        throw error(404, 'Workout not found');
    }
    const exerciseId = params.exerciseId;

    if (!params.sessionId) {
        throw error(404, 'Session not found');
    }
    const sessionId = params.sessionId;

    const callback = getCallbackFromQuery(url.searchParams.get("callback"));

    return {
        sessionId,
        exerciseId,
        callback
    }
}
