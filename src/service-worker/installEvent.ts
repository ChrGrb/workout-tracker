import { CACHE_NAME } from './constants';
import { build } from '$service-worker';
export default (event: any): void => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Open a cache and cache our files
            //cache.addAll(build);
            return true;
        }),
    );

};