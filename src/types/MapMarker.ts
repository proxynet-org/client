import { LatLng } from 'react-native-maps';

export type MapMarker =
  | {
      type: 'post';
      id: string;
      coordinate: LatLng;
      title: string;
      img: string;
      likes: number;
      dislikes: number;
      comments: number;
      timestamp: number;
    }
  | {
      type: 'chatroom';
      id: string;
      coordinate: LatLng;
      title: string;
      img: string;
      people: number;
      verified: boolean;
    };
