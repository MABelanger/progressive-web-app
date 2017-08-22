'use strict';

self.addEventListener('install', (event)=>{
  console.log('From SW: Install Event', event);
});

self.addEventListener('activate', (event)=>{
  console.log('From SW: Activate Event', event);
});
