import localforage from 'localforage';

let limit = 3;
let lastItemKey = null;

const carInstance = localforage.createInstance({
  name: "cars"
});

function addCars(newCars){
  return new Promise((resolve, reject)=>{

    newCars.forEach((newCar)=>{
      newCar.key = newCar.key.toString()

      carInstance.setItem(newCar.key, newCar.value)
      .then(()=>{
        resolve();
        return carInstance.getItem(newCar.key);
      })
      .then((value)=>{
      })
      .catch((err)=>{
        console.log('err', err);
      });
    });
  });
}

function getCars(){
  return new Promise((resolve, reject)=>{
    carInstance.keys().then((keys)=>{
      let index = keys.indexOf(lastItemKey);
      if(index == -1){
        index = keys.length;
      } else if(index == 0){
        resolve([]);
        return;
      }

      let rangeKeys = keys.splice(index - limit, limit);

      lastItemKey = rangeKeys[0];
      let carPromises = rangeKeys.map((key)=>{
        return carInstance.getItem(key)
      }).reverse()

      Promise.all(carPromises)
      .then((cars)=>{
        resolve(cars);
      });
    });
  });
}

function getLastItemKey(){
  return lastItemKey;
}

export default {
  addCars,
  getCars,
  getLastItemKey
}
