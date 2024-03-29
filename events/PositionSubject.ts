import { LatLng } from 'react-native-maps';
import { distanceInMeters } from '@/utils/distanceInMeters';

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

  public getDistanceInMeters(position: LatLng) {
    return distanceInMeters(this.position, position);
  }

  public subscribe(observer: PositionObserver) {
    console.log('subscribe to position');
    this.observers.push(observer);
  }

  public unsubscribe(observer: PositionObserver) {
    console.log('unsubscribe to position');
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  public notify(position: LatLng) {
    console.log('notify position', position);
    this.position = position;
    this.observers.forEach((observer) => observer(position));
  }
}

const positionSubject = new PositionSubject();

export default positionSubject;
