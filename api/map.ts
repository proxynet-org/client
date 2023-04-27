import { LatLng } from 'react-native-maps';
import { Post } from '@/types/post';
import { Chatroom } from '@/types/chatroom';

import { BASE_URL_WS } from './api';

export const MAP_ENDPOINT = '/map';

export function openMap(
  onNewPost: (post: Post) => void,
  onNewChatRoom: (chatroom: Chatroom) => void,
  onOpen: () => void,
  onClose: () => void,
) {
  console.log('Opening map...');
  const ws = new WebSocket(`${BASE_URL_WS}${MAP_ENDPOINT}`);

  const sendPosition = (position: LatLng) => {
    ws.send(
      JSON.stringify({
        position,
      }),
    );
  };

  const closeMap = () => {
    console.log('Closing map...');
    ws.close();
  };

  ws.onmessage = (e: MessageEvent<string>) => {
    const data = JSON.parse(e.data);
    switch (data.type) {
      case 'post':
        onNewPost(data);
        break;
      case 'chatroom':
        onNewChatRoom(data);
        break;
      default:
        break;
    }
  };

  ws.onopen = onOpen;
  ws.onclose = () => {
    console.log("Retry connection... (before calling map's socket closed)");
    onClose();
  };
  ws.onerror = (e) => {
    console.log('Error: ', e);
  };

  return { sendPosition, closeMap };
}
