import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// 1. Claim clients immediately (Replaces workbox.core.clientsClaim())
clientsClaim();

// 2. Pre-cache your app assets (Replaces workbox.precaching.precacheAndRoute)
precacheAndRoute(self.__WB_MANIFEST || []);

// 3. Cache styles and scripts (Replaces your original registerRoute)
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate()
);

// Optional: Force the waiting service worker to become active immediately
self.addEventListener('install', () => self.skipWaiting());
