import { LatLng } from 'react-native-maps';
import { Media } from '@/types/gallery';

// get
export type Publication = {
  id: string;
  title: string;
  media: string;
  likes: number;
  dislikes: number;
  comments: number;
  coordinates: LatLng;
};

// post
export type PublicationPayload = {
  title: string;
  media: Media;
};

// get
export type PublicationComment = {
  id: string;
  postId: string;
  parentId?: string;
  text: string;
  replies: number;
  likes: number;
  dislikes: number;
};

// post
export type PostCommentPayload = {
  postId: string;
  parentId?: string;
  text: string;
};
