import { LatLng } from 'react-native-maps';
import { Media } from './gallery';

// get
export type Chatroom = {
  id: string;
  media: string;
  name: string;
  description: string;
  people: number;
  coordinates: LatLng;
};

// post
export type ChatroomPayload = {
  name: string;
  description: string;
  lifetime: number;
  capacity: number;
  media: Media;
};
