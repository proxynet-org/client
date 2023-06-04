import { LatLng } from 'react-native-maps';
import { ImageURISource } from 'react-native';

export type SnackbarState = {
  open: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration: number;
};

export type MapMarker = {
  id: string;
  coordinates: LatLng;
  icon?: number | ImageURISource;
  onPress?: () => void;
};
