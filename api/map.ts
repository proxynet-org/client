import { LatLng } from 'react-native-maps';
import { Publication } from '@/types/publications';
import { Chatroom } from '@/types/chatroom';

import api, { BASE_URL_WS } from './api';

export const MAP_ENDPOINT = '/map';

export function updatePosition(position: LatLng) {
  console.log('Updating position...');

  api.post('/users/location/', position);
}

export function openMap(
  onNewPublication?: (publication: Publication) => void,
  onNewChatRoom?: (chatroom: Chatroom) => void,
  onOpen?: () => void,
  onClose?: () => void,
) {
  console.log('Opening map...');
  const ws = new WebSocket(`${BASE_URL_WS}${MAP_ENDPOINT}/`);

  const closeMap = () => {
    console.log('Closing map...');
    ws.close();
  };

  const sendMessage = (type: string, data: object) => {
    console.log(`Sending ${type}`, data);
    ws.send(
      JSON.stringify({
        type,
        data,
      }),
    );
  };

  ws.onmessage = (e: MessageEvent<string>) => {
    const data = JSON.parse(e.data);
    switch (data.type) {
      case 'publication':
        onNewPublication?.(data);
        break;
      case 'chatroom':
        onNewChatRoom?.(data);
        break;
      default:
        break;
    }
  };

  if (onOpen) ws.onopen = onOpen;
  ws.onclose = () => {
    console.log("Retry connection... (before calling map's socket closed)");
    onClose?.();
  };
  ws.onerror = (e) => {
    console.log('Error: ', e);
  };

  return { closeMap, sendMessage, ws };
}

export function sendPublication(publication: Publication) {
  const { ws, sendMessage, closeMap } = openMap();

  ws.onopen = () => {
    sendMessage('publication', publication);
    closeMap();
  };
}

export function sendChatroom(chatroom: Chatroom) {
  const { ws, sendMessage, closeMap } = openMap();

  ws.onopen = () => {
    sendMessage('chatroom', chatroom);
    closeMap();
  };
}
