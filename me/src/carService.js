import clientStorage from './clientStorage';

let apiUrlPath = 'https://bstavroulakis.com/pluralsight/courses/progressive-web-apps/service/';
let apiUrlLatest = apiUrlPath + 'latest-deals.php?carId=';
let apiUrlCar = apiUrlPath + 'car.php?carId=';



function loadMoreRequest() {
  return new Promise((resolve, reject)=>{
    fetchPromise()
    .then((connectionStatus)=>{
      loadMore()
      .then((cars)=>{
        let response = {
          cars,
          connectionStatus
        };
        resolve(response);
      })
    })
  });
};

function fetchPromise(){
  return new Promise((resolve, reject)=>{
    fetch(apiUrlLatest + clientStorage.getLastItemKey())
    .then((response)=>{
      return response.json();
    }).then((data)=>{
      clientStorage.addCars(data.cars)
      .then(()=>{
        // Precache each pages
        data.cars.forEach((car)=>{
          preCacheDetailsPage(car)
        });
        resolve("the connection is OK, show online results")
      })
    }).catch((e)=>{
      resolve("No connection, show offline results")
    })
    setTimeout(()=>{
      resolve("The connection is hanging, show offline results")
    }, 3000);
  })
}

function loadMore(){
  return clientStorage.getCars();
}

function loadCarPage(carId) {
  return new Promise((resolve, reject)=>{
    let url = apiUrlCar + carId;
    fetch(url)
    .then((response)=>{
      return response.json();
    }).then((data)=>{
      resolve(data);
    }).catch((error)=>{
      reject(error)
    })
  });
}

function preCacheDetailsPage(car){
  console.log('___car', car)
  if('serviceWorker' in navigator){
    let url = apiUrlCar + car.value.details_id;
    window.caches.open('carDealsCachePagesV1')
    .then((cache)=>{
      // Key value (key = url, value=data of the page)
       cache.match(url).then((response)=>{
         if(!response){
           cache.add(new Request(url))
         }
       })
    })
  }
}


export default {
  loadMoreRequest,
  loadCarPage,
  loadMore,
  preCacheDetailsPage
}
