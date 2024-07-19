import { error } from '@sveltejs/kit'
import type { PageLoadEvent } from './$types';
import { getCallbackFromQuery } from '$lib/utils/routing/callbacks';

export async function load({ params, fetch, url }: PageLoadEvent) {
    if (!params.exerciseId) {
        error(404, 'Workout not found');
    }
    const exerciseId = params.exerciseId;

    if (!params.sessionId) {
        error(404, 'Session not found');
    }
    const sessionId = params.sessionId;

    const hasTimer = url.searchParams.get('hasTimer') === 'true';

    const callback = getCallbackFromQuery(url.searchParams.get("callback") ?? '/overview');


    return {
        hasTimer: hasTimer,
        sessionId: sessionId,
        exerciseId: exerciseId,
        callback: callback,
    }
};
