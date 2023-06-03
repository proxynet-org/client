import { LatLng } from 'react-native-maps';
import { Media } from './gallery';

// get
export type Chatroom = {
  id: string;
  image: string;
  name: string;
  description: string;
  num_people: number;
  coordinates: LatLng;
};

// post
export type ChatroomPayload = {
  name: string;
  description: string;
  lifetime: number;
  capacity: number;
  image: Media;
};
