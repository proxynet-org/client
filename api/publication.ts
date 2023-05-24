import { Platform } from 'react-native';
import {
  Publication,
  PublicationComment,
  PublicationPayload,
} from '@/types/publications';
import api from './api';

export const PUBLICATIONS_ENDPOINT = '/publications';
export const COMMENTS_ENDPOINT = '/comments';
const REPLIES_ENDPOINT = '/replies';

export function getPublications() {
  console.log('Getting publications...');
  return api.get(PUBLICATIONS_ENDPOINT);
}

export function getPublication(id: string) {
  console.log('Getting publication...', id);
  return api.get(PUBLICATIONS_ENDPOINT, {
    params: {
      id,
    },
  });
}

export async function createPublication(publication: PublicationPayload) {
  console.log('Creating post...');
  const data = new FormData();

  data.append('media', {
    name: publication.media.name,
    type: `${publication.media.type}/${publication.media.uri.split('.').pop()}`,
    uri:
      Platform.OS === 'ios'
        ? publication.media.uri?.replace('file://', '')
        : publication.media.uri,
  } as any);

  data.append('title', publication.title);

  const res = await api.post<Publication>(PUBLICATIONS_ENDPOINT, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });

  return res;
}

export function getPublicationComments(postId: string) {
  console.log('Getting post comments...', postId);
  return api.get(`${PUBLICATIONS_ENDPOINT}/${postId}/${COMMENTS_ENDPOINT}/`);
}

export function getPostCommentReplies(postId: string, id: string) {
  console.log('Getting post comment replies...', postId, id);
  return api.get(
    `${PUBLICATIONS_ENDPOINT}/${postId}/${COMMENTS_ENDPOINT}/${id}/${REPLIES_ENDPOINT}/`,
  );
}

export function createPublicationComment(
  postId: string,
  text: string,
  parentId?: string,
) {
  console.log('Creating post comment...', postId, text, parentId);
  return api.post<PublicationComment>(
    `${PUBLICATIONS_ENDPOINT}/${postId}/${COMMENTS_ENDPOINT}/${
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
