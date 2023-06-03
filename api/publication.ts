import { getCurrentPositionAsync } from 'expo-location';
import { Platform } from 'react-native';
import {
  Publication,
  PublicationComment,
  PublicationPayload,
  Reaction,
} from '@/types/publications';
import api, { BASE_URL_WS } from './api';

import { updatePosition } from './map';

export const PUBLICATION_ENDPOINT = '/publications';
export const COMMENTS_ENDPOINT = '/comment';
const REPLIES_ENDPOINT = '/reply';

export async function getPublications() {
  console.log('Getting Publications...');
  const res = await api.get(PUBLICATION_ENDPOINT);
  console.log('Got Publications: ', res.data);
  return res;
}

export function subscribePublications(
  onMessage: (message: Publication) => void,
) {
  console.log('Subscribing Publications...');
  const ws = new WebSocket(`${BASE_URL_WS}${PUBLICATION_ENDPOINT}/`);

  function unsubscribePublications() {
    console.log('Unsubscribing Publications...');
    ws.close();
  }

  function onmessage(e: MessageEvent<string>) {
    const { message } = JSON.parse(e.data);
    const data = JSON.parse(message) as Publication;
    console.log('Got Publication: ', data);
    onMessage(data);
  }

  ws.onmessage = onmessage;
  ws.onopen = () => {
    console.log('Subscribed Publications');
  };
  ws.onclose = () => {
    console.log('Unsubscribed Publications');
  };
  ws.onerror = (e) => {
    console.log('Error: ', e);
  };

  return { unsubscribePublications, ws };
}

export async function getPublication(id: string) {
  console.log('Getting Publication...', id);
  const res = await api.get<Publication>(`${PUBLICATION_ENDPOINT}/${id}`);
  console.log('Got Publication: ', res.data);
  return res;
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

  const ws = new WebSocket(`${BASE_URL_WS}${PUBLICATION_ENDPOINT}/`);
  ws.onopen = () => {
    ws.send(JSON.stringify(res.data));
  };

  return res;
}

export async function getPublicationComments(publicationId: string) {
  console.log('Getting Publication comments...', publicationId);
  const res = await api.get<PublicationComment[]>(
    `${PUBLICATION_ENDPOINT}/${publicationId}${COMMENTS_ENDPOINT}/`,
  );
  console.log('Got Publication comments: ', res.data);
  return res;
}

export async function getPublicationCommentReplies(
  publicationId: string,
  id: string,
) {
  console.log('Getting Publication comment replies...', publicationId, id);
  const res = await api.get(
    `${PUBLICATION_ENDPOINT}/${publicationId}${COMMENTS_ENDPOINT}/${id}${REPLIES_ENDPOINT}/`,
  );
  console.log('Got Publication comment replies: ', res.data);
  return res;
}

export async function postPublicationComment(
  publicationId: string,
  text: string,
  parentId?: string,
) {
  console.log('Creating Publication comment...', publicationId, text, parentId);
  const res = await api.post<PublicationComment>(
    `${PUBLICATION_ENDPOINT}/${publicationId}${COMMENTS_ENDPOINT}/${
      parentId ? `${parentId}${REPLIES_ENDPOINT}/` : ''
    }`,
    {
      publicationId,
      parentId,
      text,
    },
  );
  return res;
}

export async function reactPublication(
  publicationId: string,
  reaction: Reaction,
) {
  console.log('Reacting Publication...', publicationId, reaction);
  const res = await api.post<Publication>(
    `${PUBLICATION_ENDPOINT}/${publicationId}/${reaction.toLowerCase()}/`,
  );

  return res;
}
