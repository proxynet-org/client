import { getCurrentPositionAsync } from 'expo-location';
import { Platform } from 'react-native';
import {
  Publication,
  PublicationComment,
  PublicationPayload,
} from '@/types/publications';
import api from './api';

import { updatePosition, sendPublication } from './map';

export const PUBLICATION_ENDPOINT = '/publications';
export const COMMENTS_ENDPOINT = '/comments';
const REPLIES_ENDPOINT = '/replies';

export function getPublications() {
  console.log('Getting Publications...');
  return api.get(PUBLICATION_ENDPOINT);
}

export function getPublication(id: string) {
  console.log('Getting Publication...', id);
  return api.get(PUBLICATION_ENDPOINT, {
    params: {
      id,
    },
  });
}

export async function createPublication(publication: PublicationPayload) {
  const position = await getCurrentPositionAsync();
  updatePosition(position.coords);

  console.log('Creating Publication...');
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

  const res = await api.post<Publication>(PUBLICATION_ENDPOINT, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });

  sendPublication(res.data);

  return res;
}

export function getPublicationComments(publicationId: string) {
  console.log('Getting Publication comments...', publicationId);
  return api.get(
    `${PUBLICATION_ENDPOINT}/${publicationId}/${COMMENTS_ENDPOINT}/`,
  );
}

export function getPublicationCommentReplies(
  publicationId: string,
  id: string,
) {
  console.log('Getting Publication comment replies...', publicationId, id);
  return api.get(
    `${PUBLICATION_ENDPOINT}/${publicationId}/${COMMENTS_ENDPOINT}/${id}/${REPLIES_ENDPOINT}/`,
  );
}

export function createPublicationComment(
  publicationId: string,
  text: string,
  parentId?: string,
) {
  console.log('Creating Publication comment...', publicationId, text, parentId);
  return api.post<PublicationComment>(
    `${PUBLICATION_ENDPOINT}/${publicationId}/${COMMENTS_ENDPOINT}/${
      parentId ? `${parentId}/${REPLIES_ENDPOINT}/` : ''
    }`,
    {
      publicationId,
      parentId,
      text,
      replies: 0,
      likes: 0,
      dislikes: 0,
    },
  );
}
