// service-worker/index.ts
import fetchEvent from './fetchEvent';
import installEvent from './installEvent';

// has to be var, because we need function scope
declare var self: any;
/**
 * Takes care of the installation of the service worker, as well as the creation of the cache.
 */
self.addEventListener('install', installEvent);
/**
 * Intercepts requests made by the page so we can decide what to do with each one.
 */
//self.addEventListener('fetch', fetchEvent);

self.skipWaiting();