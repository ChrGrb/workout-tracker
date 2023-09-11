// service-worker/index.ts
import fetchEvent from './service-worker/fetchEvent';
import installEvent from './service-worker/installEvent';
import { precacheAndRoute } from 'workbox-precaching';

// has to be var, because we need function scope
declare var self: any;
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