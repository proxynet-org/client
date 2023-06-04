import { LatLng } from 'react-native-maps';

export function distanceInMeters(point1: LatLng, point2: LatLng): number {
  // Convert latitude and longitude from degrees to radians
  const toRadians = (angle: number): number => (angle * Math.PI) / 180;
  const radLat1 = toRadians(point1.latitude);
  const radLon1 = toRadians(point1.longitude);
  const radLat2 = toRadians(point2.latitude);
  const radLon2 = toRadians(point2.longitude);

  // Earth's radius in kilometers
  const radius = 6371;

  // Haversine formula
  const dLat = radLat2 - radLat1;
  const dLon = radLon2 - radLon1;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) *
      Math.cos(radLat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = radius * c * 1000;

  return distance;
}

export default { distanceInMeters };
