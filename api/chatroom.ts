import { Platform } from 'react-native';
import { Chatroom, ChatroomPayload } from '@/types/chatroom';
import api, { BASE_URL_WS } from './api';

export const CHATROOMS_ENDPOINT = '/chatrooms';

export function getChatrooms() {
  return api.get<Chatroom[]>(CHATROOMS_ENDPOINT);
}

export function createChatroom(chatroom: ChatroomPayload) {
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
  data.append('latitude', chatroom.coordinates.latitude.toString());
  data.append('longitude', chatroom.coordinates.longitude.toString());

  return api.post<Chatroom>(CHATROOMS_ENDPOINT, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function joinChatroom(
  chatroom: Chatroom,
  onMessage: (message: string) => void,
  onOpen: () => void,
  onClose: () => void,
) {
  const { id } = chatroom;

  const ws = new WebSocket(`${BASE_URL_WS}${CHATROOMS_ENDPOINT}/${id}`);

  const sendMessage = (message: string) => {
    ws.send(
      JSON.stringify({
        message,
      }),
    );
  };

  const leaveChatroom = () => {
    ws.close();
  };

  ws.onmessage = (e: MessageEvent<string>) => {
    const data = JSON.parse(e.data);
    onMessage(data);
  };

  ws.onopen = onOpen;
  ws.onclose = (ev) => {
    console.log(
      "Retry connection... (before calling chatroom's socket closed)",
      ev.code,
    );
    onClose();
  };

  return { sendMessage, leaveChatroom };
}
