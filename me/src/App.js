import React, { Component } from 'react';
import './App.css';
import CarCards from './CarCards';
import carService from './carService';

import swRegister from './swRegister';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cars : [],
      car : {}
    }
    this.loadCarPage = this.loadCarPage.bind(this);
    this.loadMoreRequest = this.loadMoreRequest.bind(this);
  }
  componentDidMount(){
    let promise = carService.loadMore();
    promise.then((cars)=>{
      this.setState({cars})
    })
  }

  loadCarPage(carId){
    let promise = carService.loadCarPage(carId);
    promise.then(({car})=>{
      this.setState({car})
    })
  }

  loadMoreRequest(){
    console.log('loadMore')
    carService.loadMoreRequest()
    .then((response)=>{
      let {cars, connectionStatus} = response;
      console.log('connectionStatus', connectionStatus)
      console.log('cars', cars)
      this.setState({cars: this.state.cars.concat(cars)})
    })
  }

  render() {
    return (
      <div>
        <CarCards
          cars={this.state.cars}
          loadCarPage={this.loadCarPage}
        />
        <button
          onClick={()=>{
            this.loadMoreRequest()}
          }
        >LoadMore</button>
      </div>
    );
  }
}

export default App;
