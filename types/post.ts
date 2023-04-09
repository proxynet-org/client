import { Media } from '@/types/gallery';

export type Post = {
  id: string;
  title: string;
  media: string;
  likes: number;
  dislikes: number;
  comments: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export type PostPayload = {
  title: string;
  media: Media;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export type PostComment = {
  id: string;
  postId: string;
  parentId?: string;
  text: string;
  likes: number;
  dislikes: number;
  replies: number;
};

export type PostCommentPayload = {
  postId: string;
  parentId?: string;
  text: string;
};
