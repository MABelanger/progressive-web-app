// Check the compatibility and Register our service worker
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
  .then((swRegistration)=>{
    console.log('swRegistration', swRegistration);
  }).catch((error)=>{
    console.log( error);
  })
}
