import { LatLng } from 'react-native-maps';

export type ChatMessage = {
  id: number;
  user: number;
  text: string;
  created_at: string;
  updated_at: string;
  coordinates: LatLng;
};

export type ChatMessagePayload = {
  text: string;
};
