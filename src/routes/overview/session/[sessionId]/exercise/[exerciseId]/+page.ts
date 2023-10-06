import { error } from '@sveltejs/kit'
import type { PageLoadEvent } from './$types';

export async function load({ params, fetch, url }: PageLoadEvent) {
    if (!params.exerciseId) {
        throw error(404, 'Workout not found');
    }
    const exerciseId = params.exerciseId;

    if (!params.sessionId) {
        throw error(404, 'Session not found');
    }
    const sessionId = params.sessionId;

    const hasTimer = url.searchParams.get('hasTimer') === 'true';


    return {
        hasTimer: hasTimer,
        sessionId: sessionId,
        exerciseId: exerciseId,
    }
};
