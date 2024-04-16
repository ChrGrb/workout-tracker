import { getCallbackFromQuery } from "$lib/utils/routing/callbacks";
import type { PageLoadEvent } from "./$types";

export async function load({ params, url }: PageLoadEvent) {
    const callback = getCallbackFromQuery(url.searchParams.get("callback"));

    return {
        sessionId: params.sessionId,
        callback
    }
}