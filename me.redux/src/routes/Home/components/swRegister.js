// Check the compatibility and Register our service worker
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
  .then((swRegistration)=>{
    let serviceWorker = null;
    if(swRegistration.installing) {
      console.log('SW installing: ');
      serviceWorker = swRegistration.installing;
    }else if(swRegistration.waiting){
      console.log('SW installed/waiting: ');
      serviceWorker = swRegistration.waiting;
    }else if(swRegistration.active){
      console.log('SW activated: ');
      serviceWorker = swRegistration.active;
    }
    if(serviceWorker != null) {
      serviceWorker.addEventListener('statechange', (e)=>{
          console.log('SW statechange: ');
      })
    }
  }).catch((error)=>{
    console.log( error);
  })
}
