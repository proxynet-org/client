import { LatLng } from 'react-native-maps';

export type MapMarker = {
  id: string;
  coordinate: LatLng;
  type: 'post' | 'forum';
  title: string;
  img: string;
};

export type MarkerPost = MapMarker & {
  type: 'post';
  likes: number;
  dislikes: number;
  comments: number;
  timestamp: number;
};

export type MarkerForum = MapMarker & {
  type: 'forum';
  people: number;
  verified: boolean;
};
