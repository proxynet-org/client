import { createContext } from 'react';
import { MapMarker } from 'types';

export type WebSocketContextEventMap = {
  newPost: MapMarker & { type: 'post' };
  newChatRoom: MapMarker & { type: 'chatroom' };
  delPost: { id: string };
  delChatRoom: { id: string };
};

interface WebSocketContextValue {
  connected: boolean;
  error: Event | Error | null;
  addCallback<K extends keyof WebSocketContextEventMap>(
    type: K,
    callback: (event: WebSocketContextEventMap[K]) => void,
  ): void;
  removeCallback<K extends keyof WebSocketContextEventMap>(
    type: K,
    callback: (event: WebSocketContextEventMap[K]) => void,
  ): void;
  connect(userToken: string): void;
  disconnect(): void;
}

export const WebSocketContext = createContext<WebSocketContextValue>({
  connected: false,
  error: null,
  addCallback: () => console.log('add callback'),
  removeCallback: () => console.log('remove callback'),
  connect: (userTokent) => console.log('connect with token', userTokent),
  disconnect: () => console.log('disconnect'),
});
