import { LatLng } from 'react-native-maps';
import { Post } from '@/types/post';
import { Chatroom } from '@/types/chatroom';

import api from './api';

export default function openMap(
  onNewPost: (post: Post) => void,
  onNewChatRoom: (chatroom: Chatroom) => void,
) {
  const ws = new WebSocket(
    `ws://${api.defaults.baseURL?.replace('http://', '')}/ws/map`,
  );

  const sendPosition = (position: LatLng) => {
    ws.send(
      JSON.stringify({
        position,
      }),
    );
  };

  const closeMap = () => {
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

  ws.onopen = () => {
    console.log('ws opened');
  };

  ws.onclose = () => {
    console.log('ws closed');
  };

  return { sendPosition, closeMap };
}
