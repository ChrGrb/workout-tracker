// service-worker/index.ts
import { clientsClaim } from 'workbox-core/clientsClaim';
import fetchEvent from './service-worker/fetchEvent';
import installEvent from './service-worker/installEvent';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import "/beams-sw.js?url";

// has to be var, because we need function scope
declare var self: any;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

/**
 * Takes care of the installation of the service worker, as well as the creation of the cache.
 */
self.addEventListener('install', installEvent);
/**
 * Intercepts requests made by the page so we can decide what to do with each one.
 */
self.addEventListener('fetch', fetchEvent);

self.skipWaiting();
clientsClaim();