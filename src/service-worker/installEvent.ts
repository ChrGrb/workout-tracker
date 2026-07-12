import { CACHE_NAME } from './constants';
export default (event: ExtendableEvent): void => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(() => {
            // Open a cache and cache our files
            //cache.addAll(build);
            return true;
        }),
    );

};