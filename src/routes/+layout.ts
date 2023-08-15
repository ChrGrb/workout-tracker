import type { LoadEvent } from "@sveltejs/kit";
import { dev } from '$app/environment';
import { inject } from '@vercel/analytics';

inject({ mode: dev ? 'development' : 'production' });

export function load({ url }: LoadEvent) {
    return {
        url: url.pathname,
    }
}