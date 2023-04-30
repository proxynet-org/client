import { Platform } from 'react-native';
import {
  Publication,
  PublicationComment,
  PublicationPayload,
} from '@/types/publications';
import api from './api';

export const POSTS_ENDPOINT = '/publications';
export const COMMENTS_ENDPOINT = '/comments';
const REPLIES_ENDPOINT = '/replies';

export function getPosts() {
  console.log('Getting posts...');
  return api.get(POSTS_ENDPOINT);
}

export function getPost(id: string) {
  console.log('Getting post...', id);
  return api.get(POSTS_ENDPOINT, {
    params: {
      id,
    },
  });
}

export function createPost(post: PublicationPayload) {
  console.log('Creating post...');
  const data = new FormData();

  data.append('media', {
    name: post.media.name,
    type: `${post.media.type}/${post.media.uri.split('.').pop()}`,
    uri:
      Platform.OS === 'ios'
        ? post.media.uri?.replace('file://', '')
        : post.media.uri,
  } as any);

  data.append('title', post.title);

  return api.post<Publication>(POSTS_ENDPOINT, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function getPostComments(postId: string) {
  console.log('Getting post comments...', postId);
  return api.get(`${POSTS_ENDPOINT}/${postId}/${COMMENTS_ENDPOINT}/`);
}

export function getPostCommentReplies(postId: string, id: string) {
  console.log('Getting post comment replies...', postId, id);
  return api.get(
    `${POSTS_ENDPOINT}/${postId}/${COMMENTS_ENDPOINT}/${id}/${REPLIES_ENDPOINT}/`,
  );
}

export function createPostComment(
  postId: string,
  text: string,
  parentId?: string,
) {
  console.log('Creating post comment...', postId, text, parentId);
  return api.post<PublicationComment>(
    `${POSTS_ENDPOINT}/${postId}/${COMMENTS_ENDPOINT}/${
      parentId ? `${parentId}/${REPLIES_ENDPOINT}/` : ''
    }`,
    {
      postId,
      parentId,
      text,
      replies: 0,
      likes: 0,
      dislikes: 0,
    },
  );
}
