import { Media } from './gallery';

export type ChatroomPayload = {
  name: string;
  description: string;
  lifetime: number;
  capacity: number;
  media: Media;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export type Chatroom = {
  id: string;
  media: string;
  name: string;
  description: string;
  people: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};
