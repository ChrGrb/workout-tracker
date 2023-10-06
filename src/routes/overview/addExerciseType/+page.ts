import { getCallbackFromQuery } from "$lib/utils/routing/callbacks";
import { getOverviewPath } from "$lib/utils/routing/routes";
import type { PageLoadEvent } from "../session/[sessionId]/$types";

export async function load({ params, url }: PageLoadEvent) {
    let callback = url.searchParams.get('callback');
    if (callback) {
        callback = getCallbackFromQuery(callback);
    } else {
        callback = getOverviewPath;
    }

    return {
        callback: callback,
    }
}
