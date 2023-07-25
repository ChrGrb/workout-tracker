import type { LoadEvent } from "@sveltejs/kit";

export function load({ url }: LoadEvent) {
    return {
        url: url.pathname,
    }
}