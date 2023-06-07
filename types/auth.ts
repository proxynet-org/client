import { LatLng } from 'react-native-maps';

export type SignUpPayload = {
  first_name: string;
  last_name: string;
  username: string;
  birthDate: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/**
 * @param id - username
 */
export type SignInPayload = { username: string; password: string };

export type Token = {
  access: string;
  refresh: string;
};

export type User = {
  username: string;
  coordinates: LatLng;
  email: string;
  first_name: string;
  last_name: string;
  id: number;
};
