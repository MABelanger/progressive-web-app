import React from 'react';


const CarCard = ({car, loadCarPage}) =>{
  return(
    <div
      onClick={(e)=>{
        loadCarPage(car.id)
      }}
    >
      brand : {car.brand}<br/>
      image : <img src={car.image} width="100px"/><br/>
      price : {car.price}
      <hr/>
    </div>
  );
}

const CarCards = ({cars, loadCarPage}) => {
  if(!cars) return null;
  let carCards = cars.map((car)=>{
    return <CarCard
      key={car.id}
      car={car}
      loadCarPage={loadCarPage}
    />
  })
  return (<div> {carCards} </div>)
}

export default CarCards;
