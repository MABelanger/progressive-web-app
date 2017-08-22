'use strict';

let carDealCacheName = 'carDealCacheNameV2';
let carDealCachePageName = 'carDealCachePageNameV2';

let carDealCacheFiles = [
  '/',
  '/manifest.js',
  '/normalize.js',
  '/vendor.js',
  '/main.js'
];

self.addEventListener('install', (event)=>{
  console.log('From SW: Install Event', event);
  // Until the promise in the event.waitUntil is resolve.
  // That enable the next event only when event.waitUntil is finished
  event.waitUntil(
    caches.open(carDealCacheName)
    .then((cacheStorage)=>{
      let promiseAddAll = cacheStorage.addAll(carDealCacheFiles);
      return promiseAddAll;
    })
  );
});

self.addEventListener('activate', (event)=>{
  console.log('From SW: Activate Event', event);
  event.waitUntil(
    caches.keys()
    .then((cacheKeys)=>{
      let deletePromises = [];
      cacheKeys.forEach((cacheKey)=>{
        console.log('cacheKey2', cacheKey)
        if(cacheKey != carDealCacheName && cacheKey != carDealCachePageName) {
          console.log('cacheKey', cacheKey)
          deletePromises.push(caches.delete(cacheKey))
        }
      });
      let promiseAll = Promise.all(deletePromises);
      return promiseAll;
    })
  )
});
