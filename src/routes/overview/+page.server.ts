import type { Actions, RequestEvent } from './$types';
import { error } from '@sveltejs/kit';



export const actions: Actions = {
    updateTimerSettings: async ({ request, fetch }: RequestEvent) => {
        const form = await request.formData();
        const timerEnabled = form.get("timerEnabled");
        const timerDuration = form.get("timerDuration");
        const userId = form.get("userId");

        try {
            await fetch(
                "/api/user/" + userId + "/settings/timer",
                {
                    method: "PUT",
                    body: JSON.stringify({ enabled: timerEnabled, duration: timerDuration }),
                    headers: {
                        "content-type": "application/json",
                    }
                }
            );
        } catch (responseError) {
            error(400, 'Could not finish current session');
        }
    }
}