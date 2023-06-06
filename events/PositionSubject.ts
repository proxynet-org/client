import { LatLng } from 'react-native-maps';

export type PositionObserver = (position: LatLng) => void;

class PositionSubject {
  private observers: PositionObserver[] = [];

  private position: LatLng = {
    latitude: 0,
    longitude: 0,
  };

  public getPosition() {
    return this.position;
  }

  public subscribe(observer: PositionObserver) {
    this.observers.push(observer);
  }

  public unsubscribe(observer: PositionObserver) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  public notify(position: LatLng) {
    this.position = position;
    this.observers.forEach((observer) => observer(position));
  }
}

const positionSubject = new PositionSubject();

export default positionSubject;
