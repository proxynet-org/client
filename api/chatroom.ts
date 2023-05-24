import { Platform } from 'react-native';
import { getCurrentPositionAsync } from 'expo-location';
import { Chatroom, ChatroomPayload } from '@/types/chatroom';

import api, { BASE_URL_WS } from './api';
import { updatePostion, sendChatroom } from './map';

export const CHATROOMS_ENDPOINT = '/chatrooms';

export function getChatrooms() {
  console.log('Getting chatrooms...');
  return api.get<Chatroom[]>(CHATROOMS_ENDPOINT);
}

export async function createChatroom(chatroom: ChatroomPayload) {
  const position = await getCurrentPositionAsync();
  updatePostion(position.coords);

  console.log('Creating chatroom...');

  const data = new FormData();

  data.append('media', {
    name: chatroom.media.name,
    type: `${chatroom.media.type}/${chatroom.media.uri.split('.').pop()}`,
    uri:
      Platform.OS === 'ios'
        ? chatroom.media.uri?.replace('file://', '')
        : chatroom.media.uri,
  } as any);

  data.append('name', chatroom.name);
  data.append('description', chatroom.description);

  const res = await api.post<Chatroom>(CHATROOMS_ENDPOINT, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });

  sendChatroom(res.data);

  return res;
}

export function joinChatroom(
  chatroom: Chatroom,
  onMessage: (message: string) => void,
  onOpen: () => void,
  onClose: () => void,
) {
  console.log('Joining chatroom...');
  const { id } = chatroom;

  const ws = new WebSocket(`${BASE_URL_WS}${CHATROOMS_ENDPOINT}/${id}`);

  const sendMessage = (message: string) => {
    console.log('Sending message...', message);
    ws.send(
      JSON.stringify({
        message,
      }),
    );
  };

  const leaveChatroom = () => {
    console.log('Leaving chatroom...');
    ws.close();
  };

  ws.onmessage = (e: MessageEvent<string>) => {
    console.log('Message received: ', e.data);
    const data = JSON.parse(e.data);
    onMessage(data);
  };

  ws.onopen = onOpen;
  ws.onclose = () => {
    console.log(
      "Retry connection... (before calling chatroom's socket closed)",
    );
    onClose();
  };
  ws.onerror = (e) => {
    console.log('Error: ', e);
  };

  return { sendMessage, leaveChatroom };
}
