import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import PushNotifications from '@pusher/push-notifications-server';
import { PUBLIC_BEAMS_INSTANCE_ID } from '$env/static/public';
import { BEAMS_SECRET_KEY } from '$env/static/private';
import { getExercisePath } from '$lib/utils/routing/routes';

export async function GET({ params, url }: RequestEvent) {
    const userId = params.userId;

    // A missing/empty user id would publish to the interest "user-" which no
    // device is subscribed to — reject it so the failure is visible instead of
    // silently swallowed.
    if (!userId || userId === 'undefined') {
        return json({ error: 'Missing userId' }, { status: 400 });
    }

    const sessionId = url.searchParams.get('sessionId');
    const exerciseId = url.searchParams.get('exerciseId');

    const beamsClient = new PushNotifications({
        instanceId: PUBLIC_BEAMS_INSTANCE_ID,
        secretKey: BEAMS_SECRET_KEY
    });

    const userInterest = `user-${userId}`;
    try {
        const response = await beamsClient.publishToInterests([userInterest], {
            web: {
                time_to_live: 3600,
                notification: {
                    title: "Time is up!",
                    body: "The break is over. Time for your next set.",
                    icon: "https://workout.zack-bumm.com/pwa-192x192.png",
                    deep_link: "https://workout.zack-bumm.com" + ((sessionId && exerciseId) ? getExercisePath({ sessionId: sessionId!, exerciseId: exerciseId! }) : ""),
                    hide_notification_if_site_has_focus: true,
                },
            },
        });

        return json({ publishId: response.publishId });
    } catch (error) {
        console.error(`Failed to publish timer notification to ${userInterest}`, error);
        return json({ error: 'Failed to publish notification' }, { status: 502 });
    }
}