'use strict';

// New 4
let carDealCacheNames = 'carDealCacheNamesV1';
let carDealCachePageNames = 'carDealCachePageNamesV1';
let carDealCacheImageNames = 'carDealCacheImageNamesV1';

let carDealCacheFiles = [
  '/',
  '/manifest.js',
  '/normalize.js',
  '/vendor.js',
  '/main.js'
];

const BASE_PATH = '/pluralsight/courses/progressive-web-apps/service';
let latestPath = BASE_PATH + '/latest-deals.php';
let imagePath = BASE_PATH + '/car-image.php';
let carPath = BASE_PATH + '/car.php';


self.addEventListener('install', (event)=>{
  console.log('From SW: Install Event', event);
  self.skipWaiting();
  // Until the promise in the event.waitUntil is resolve.
  // That enable the next event only when event.waitUntil is finished
  event.waitUntil(
    caches.open(carDealCacheNames)
    .then((cacheStorage)=>{
      let promiseAddAll = cacheStorage.addAll(carDealCacheFiles);
      return promiseAddAll;
    })
  );
});

self.addEventListener('activate', (event)=>{
  console.log('From SW: Activate Event', event);
  self.clients.claim();
  event.waitUntil(
    caches.keys()
    .then((cacheKeys)=>{
      let deletePromises = [];
      cacheKeys.forEach((cacheKey)=>{
        if(cacheKey != carDealCacheNames
          && cacheKey != carDealCachePageNames
          && cacheKey != carDealCacheImageNames
        ) {
          console.log('cacheKey -> to Delete', cacheKey)
          deletePromises.push(caches.delete(cacheKey))
        }
      });
      let promiseAll = Promise.all(deletePromises);
      console.log('promiseAll', promiseAll)
      return promiseAll;
    })
  )
});

self.addEventListener('fetch', (event)=>{
  console.log('fetch', event)
  //event.respondWith(new Response('hello'));
  let requestUrl = new URL(event.request.url);
  let requestPath = requestUrl.pathname;
  let fileName = requestPath.substring(requestPath.lastIndexOf('/') + 1);

  // Exception fetch (latest-deals.php and sw.js)
  // over the network only strategy
  if(requestPath == latestPath || fileName == 'sw.js') {
    console.log('_____Network ONLY :', fileName, requestPath)
    event.respondWith(networkOnlyStrategy(event.request));
  }else if(requestPath == imagePath) {
    console.log('_____Network FIRST :', requestPath)
    event.respondWith(networkFirstStrategy(event.request))
  } else {
    console.log('_____CacheFirst FIRST :', requestPath)
    event.respondWith(cacheFirstStrategy(event.request))
  }
})

self.addEventListener('message',(event)=>{
  console.log('From SW message Received: ', event.data)
  // resend to client
  event.source.postMessage({clientId: event.source.id, message:'message from sw'});
});

/**
  Cache first strategy
*/
function cacheFirstStrategy(request){
  return caches.match(request).then((cacheResponse)=>{
    return cacheResponse || _fetchRequestAndCache(request)
  })
}

/**
 Network only strategy
 */
function networkOnlyStrategy(request){
   return fetch(request);
}

/**
 Network First
 */
function _getCacheName(request){
  let requestUrl = new URL(request.url);
  var requestPath = requestUrl.pathname;

  if(requestPath == imagePath){
    return carDealCacheImageNames;

  } else if(requestPath == carPath) {
    return carDealCachePageNames;

  } else if(requestPath == latestPath) {
    return carDealCacheNames;
  }
}

function _cacheRequest(request, networkResponse) {
  let cacheName = _getCacheName(request);
  caches.open(cacheName).then((cache)=>{
    cache.put(request, networkResponse);
  })
}

function _fetchRequestAndCache(request){
  return fetch(request).then((networkResponse)=>{
    _cacheRequest(request, networkResponse);
    // We need to clone it because it used by fetch
    return networkResponse.clone();
  })
}

function networkFirstStrategy(request){
  // If offline or request fail, the catch is called
  // So we need to search in the caches and if we have
  // an older response for that request, we will return that.
  // with caches.match(request);
  return _fetchRequestAndCache(request).catch((response)=>{
    return caches.match(request);
  })
}
