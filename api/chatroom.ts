import { Platform } from 'react-native';
import { getCurrentPositionAsync } from 'expo-location';
import { Chatroom, ChatroomPayload } from '@/types/chatroom';

import api, { BASE_URL_WS } from './api';
import { updatePosition, sendChatroom } from './map';
import { ChatMessage, ChatMessagePayload } from '@/types/chat';
import { WebSocketMessage } from '@/types/websocket';

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

  sendChatroom(res.data);

  return res;
}

export async function joinChatroomChat(
  chatroom: Chatroom,
  onMessage: (message: ChatMessage) => void,
  onOpen: (messages: ChatMessage[]) => void,
  onClose: () => void,
) {
  console.log('Joining chatroom...');
  const { id } = chatroom;

  const ws = new WebSocket(`${BASE_URL_WS}${CHATROOMS_ENDPOINT}/${id}`);

  const sendMessage = async (message: ChatMessagePayload) => {
    console.log('Sending message...', message);
    const res = await api.post<ChatMessage>(
      `${CHATROOMS_ENDPOINT}/${id}/messages/`,
      message,
    );
    ws.send(JSON.stringify(res.data));
  };

  const leaveChatroom = () => {
    console.log('Leaving chatroom...');
    api.post(`${CHATROOMS_ENDPOINT}/${id}/leave/`);
    ws.close();
  };

  ws.onmessage = (e: MessageEvent<string>) => {
    console.log('Message received: ', e.data);
    const data = JSON.parse(e.data) as WebSocketMessage;
    const message = JSON.parse(data.message) as ChatMessage;
    onMessage(message);
  };

  ws.onopen = async () => {
    console.log('Connection established...');
    const res = await api.get<ChatMessage[]>(
      `${CHATROOMS_ENDPOINT}/${id}/messages/`,
    );
    onOpen(res.data);
  };
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
