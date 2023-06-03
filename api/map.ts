import { LatLng } from 'react-native-maps';

import api from './api';

export async function updatePosition(position: LatLng) {
  console.log('Updating position...');
  return api.post('/users/location/', { coordinates: position });
}
