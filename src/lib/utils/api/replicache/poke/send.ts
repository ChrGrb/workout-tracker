// Packages

import { REPLICACHE_PUSHER_APP_ID, REPLICACHE_PUSHER_SECRET } from "$env/static/private"
import { PUBLIC_REPLICACHE_PUSHER_KEY, PUBLIC_REPLICACHE_PUSHER_CLUSTER } from "$env/static/public"
import Pusher from "pusher"


const utilsApiPokeSend = async (userId: string) => {
    console.log('Poke channel ', userId)

    const pusher = new Pusher({
        appId: REPLICACHE_PUSHER_APP_ID,
        key: PUBLIC_REPLICACHE_PUSHER_KEY,
        secret: REPLICACHE_PUSHER_SECRET,
        cluster: PUBLIC_REPLICACHE_PUSHER_CLUSTER,
        useTLS: true
    })

    // We need to use `await` here, otherwise Next.js will frequently kill the request and the poke won't get sent.
    await pusher.trigger(userId, 'poke', {
        message: "New data available",
    });

    return
}

export default utilsApiPokeSend