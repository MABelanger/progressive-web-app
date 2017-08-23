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

    // Every time a updated service worker is found
    // but not nececerrary in control so we add
    swRegistration.addEventListener('updatefound',(e)=>{
      console.log('New service Worker found!', swRegistration)
      swRegistration.installing.addEventListener('statechange', (e)=>{
        console.log('New service worker state: ', e.target.state);
      });
    });

    // Check update every 5 seconds
    setInterval(()=>{
      swRegistration.update();
    }, 5000);

  }).catch((error)=>{
    console.log( error);
  })

  // When the serviceWorker of this page change
  // throught `self.skipWaiting()` And `self.client.claim()`
  navigator.serviceWorker.addEventListener('controllerchange', (e)=>{
    console.log('Controller change!!');
  });

  // Listen for message from sw
  navigator.serviceWorker.addEventListener('message', (event)=>{
    let clientId = event.data.clientId;
    let message = event.data.message;
    console.log('From Client: ', clientId, message);
  })

  if(navigator.serviceWorker.controller != null){
    navigator.serviceWorker.controller.postMessage('message from client');
  }

}
