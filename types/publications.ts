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
  image: string;
  num_likes: number;
  num_dislikes: number;
  num_comments: number;
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
  publication: string;
  parent_comment?: string;
  text: string;
  num_replies: number;
  likes: number;
  dislikes: number;
  num_likes: number;
  num_dislikes: number;
  reaction: Reaction;
};

// post
export type PublicationCommentPayload = {
  publicationId: string;
  parentId?: string;
  text: string;
};
