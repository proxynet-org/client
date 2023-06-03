import { LatLng } from 'react-native-maps';
import { Media } from '@/types/gallery';

export enum Reaction {
  NONE = 'NONE',
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

// get
export type Publication = {
  id: string;
  title: string;
  media: string;
  likes: number;
  dislikes: number;
  comments: number;
  coordinates: LatLng;
  createdAt: string;
  reaction: Reaction;
};

// post
export type PublicationPayload = {
  title: string;
  text: string;
  image: Media;
};

// get
export type PublicationComment = {
  id: string;
  publicationId: string;
  parentId?: string;
  text: string;
  replies: number;
  likes: number;
  dislikes: number;
};

// post
export type PublicationCommentPayload = {
  publicationId: string;
  parentId?: string;
  text: string;
};
