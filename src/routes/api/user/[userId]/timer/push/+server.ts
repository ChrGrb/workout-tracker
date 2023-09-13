import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import PushNotifications from '@pusher/push-notifications-server';
import { PUBLIC_BEAMS_INSTANCE_ID } from '$env/static/public';
import { BEAMS_SECRET_KEY } from '$env/static/private';

export async function GET({ params }: RequestEvent) {
    const userId = params.userId;


    const beamsClient = new PushNotifications({
        instanceId: PUBLIC_BEAMS_INSTANCE_ID,
        secretKey: BEAMS_SECRET_KEY
    });

    const userInterest = `user-${userId}`;
    beamsClient.publishToInterests([userInterest], {
        web: {
            time_to_live: 3600,
            notification: {
                title: "Time is up!",
                body: "The break is over. Time for your next set.",
                icon: "https://dev.workout-tracker.com:5173/pwa-192x192.png",
                deep_link: "https://dev.workout-tracker.com:5173/overview",
                hide_notification_if_site_has_focus: false,
            },
        },
    });


    return json("success");
}