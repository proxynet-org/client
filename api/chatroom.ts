import { BASE_URL_WS } from '@env';
import { Platform } from 'react-native';
import { getCurrentPositionAsync } from 'expo-location';
import { Chatroom, ChatroomPayload } from '@/types/chatroom';

import api from './api';
import { updatePosition } from './map';

export const CHATROOMS_ENDPOINT = '/chatrooms';

export async function getChatrooms() {
  console.log('Getting chatrooms...');
  const res = await api.get(CHATROOMS_ENDPOINT);
  console.log('Got chatrooms: ', res.data);
  return res;
}

export function subscribeChatrooms(onMessage: (message: Chatroom) => void) {
  console.log('Subscribing Chatrooms...');
  const ws = new WebSocket(`${BASE_URL_WS}${CHATROOMS_ENDPOINT}/`);

  function unsubscribeChatrooms() {
    console.log('Unsubscribing Chatrooms...');
    ws.close();
  }

  function onmessage(e: MessageEvent<string>) {
    const { message } = JSON.parse(e.data);
    const data = JSON.parse(message) as Chatroom;
    console.log('Got Chatroom: ', data);
    onMessage(data);
  }

  ws.onmessage = onmessage;
  ws.onopen = () => {
    console.log('Subscribed Chatrooms');
  };
  ws.onclose = () => {
    console.log('Unsubscribed Chatrooms');
  };
  ws.onerror = (e) => {
    console.log('Error: ', e);
  };

  return { unsubscribeChatrooms, ws };
}

export async function getChatroom(id: string) {
  console.log('Getting chatroom...');
  const res = await api.get<Chatroom>(`${CHATROOMS_ENDPOINT}/${id}/`);
  console.log('Got chatroom: ', res.data);
  return res;
}

export async function joinChatroom(id: string) {
  console.log('Joining chatroom...');
  const res = await api.post<Chatroom>(`${CHATROOMS_ENDPOINT}/${id}/join/`);
  console.log('Joined chatroom: ', res.data);
  return res;
}

export async function leaveChatroom(id: string) {
  console.log('Leaving chatroom...');
  const res = await api.post<Chatroom>(`${CHATROOMS_ENDPOINT}/${id}/leave/`);
  console.log('Left chatroom: ', res.data);
  return res;
}

export async function createChatroom(chatroom: ChatroomPayload) {
  const position = await getCurrentPositionAsync();
  updatePosition(position.coords);

  console.log('Creating chatroom...');
  const formData = new FormData();
  formData.append('name', chatroom.name);
  formData.append('description', chatroom.description);
  formData.append('capacity', chatroom.capacity.toString());
  formData.append('lifetime', chatroom.lifetime.toString());

  const uri =
    Platform.OS === 'android'
      ? chatroom.image.uri
      : chatroom.image.uri.replace('file://', '');
  const filename = chatroom.image.uri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename as string);
  const ext = match?.[1];
  const type = match ? `image/${match[1]}` : `image`;
  formData.append('image', {
    uri,
    name: `image.${ext}`,
    type,
  } as any);

  const res = await api.post<Chatroom>(`${CHATROOMS_ENDPOINT}/`, formData, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });

  const ws = new WebSocket(`${BASE_URL_WS}${CHATROOMS_ENDPOINT}/`);
  ws.onopen = () => {
    ws.send(JSON.stringify(res.data));
  };

  return res;
}
