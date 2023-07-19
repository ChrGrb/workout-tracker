import type { Session as OGSession, DefaultSession } from '@auth/core/types';
import { SvelteKitAuthConfig as OGSvelteKitAuthConfig } from '@auth/sveltekit';

// TODO: revert this when they fix this...
declare module '@auth/sveltekit/node_modules/@auth/core/types' {
    interface Session extends OGSession {
        user?: {
            id: string;
        } & DefaultSession['user'];
    }
}

declare module '@sveltejs/kit' {
    interface Redirect extends Error {
        status: 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;
        location: string;
    }
    interface HttpError extends Error {
        status: number;
        body: App.Error;
    }
}
