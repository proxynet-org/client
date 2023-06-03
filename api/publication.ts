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
  await updatePosition(position.coords);

  const formData = new FormData();

  formData.append('title', publication.title);
  formData.append('text', 'Test text');
  const uri =
    Platform.OS === 'android'
      ? publication.image.uri
      : publication.image.uri.replace('file://', '');
  const filename = publication.image.uri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename as string);
  const ext = match?.[1];
  const type = match ? `image/${match[1]}` : `image`;

  formData.append('image', {
    uri,
    name: `image.${ext}`,
    type,
  } as any);

  const res = await api.post<Publication>(
    `${PUBLICATION_ENDPOINT}/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

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
