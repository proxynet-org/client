import { LatLng } from 'react-native-maps';

export type PositionObserver = (position: LatLng) => void;

class PositionSubject {
  private observers: PositionObserver[] = [];

  public subscribe(observer: PositionObserver) {
    this.observers.push(observer);
  }

  public unsubscribe(observer: PositionObserver) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  public notify(position: LatLng) {
    this.observers.forEach((observer) => observer(position));
  }
}

const positionSubject = new PositionSubject();

export default positionSubject;
