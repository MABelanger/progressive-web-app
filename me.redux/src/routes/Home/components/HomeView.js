import React, { Component } from 'react';
import './styles/app.scss';
import CarCards from './CarCards';
import carService from './carService';

import swRegister from './swRegister';

class HomeView extends Component {
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
    carService.loadMoreRequest()
    .then((response)=>{
      let {cars, connectionStatus} = response;
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

export default HomeView;
