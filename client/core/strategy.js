let BaseStrategy = require('./basestrategy').BaseStrategy;
let currentTick = 0;

class Strategy extends BaseStrategy {
  onTick(myPassengers, myElevators, enemyPassengers, enemyElevators) {
    currentTick++;
    let floorMap = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    myPassengers.forEach(passenger => {
      if (passenger.state < 4) {
        floorMap[passenger.floor - 1]++;
      }
    });
    enemyPassengers.forEach(passenger => {
      if (passenger.state == 3) {
        floorMap[passenger.floor - 1] = floorMap[passenger.floor - 1] + 2;
      }
    });
    myElevators.forEach(elevator => {
      if (elevator.state == 3) {
        if (floorMap[elevator.floor - 1] < 1 && currentTick > 2500) {
          if (elevator.passengers.length > 0) {
            const destFloor = this._calcClosestDestFloor(elevator.floor, elevator.passengers);
            elevator.goToFloor(destFloor);
          } else {
            const maxPassengers = Math.max(...floorMap);
            const hotestFloor = floorMap.findIndex(passengers => {
              return passengers == maxPassengers
            });
            elevator.goToFloor(hotestFloor + 1);
          }
        } else {
          if (elevator.passengers.length > 19) {
            const destFloor = this._calcClosestDestFloor(elevator.floor, elevator.passengers);
            elevator.goToFloor(destFloor);
          } else {
            enemyPassengers.forEach(passenger => {
              if (elevator.floor == passenger.fromFloor) {
                passenger.setElevator(elevator);
              }
            });
            myPassengers.forEach(passenger => {
              if (elevator.floor == passenger.fromFloor) {
                passenger.setElevator(elevator);
              }
            });
          }
        }
      }
    });
  }

  _calcClosestDestFloor(current, passengers) {
    //надо найти ближайший этаж
    let closestFloor = 1;
    let min = 10;
    for (let passenger of passengers) {
      if (Math.abs(passenger.destFloor - current) == 1) {
        closestFloor = passenger.destFloor;
        break;
      }
      const currentDif = Math.abs(passenger.destFloor - current);
      if (currentDif < min) {
        min = currentDif;
        closestFloor = passenger.destFloor;
      }
    }
    return closestFloor;
  }
}
module.exports.Strategy = Strategy;


/*
elevators
0, waiting
1, moving
2, opening
3, filling
4, closing

*/