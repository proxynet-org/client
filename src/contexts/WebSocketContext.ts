import { createContext } from 'react';
import { MapMarkerPost, MapMarkerChatRoom } from 'types';

type NewPostEvent = MapMarkerPost;

type NewChatRoomEvent = MapMarkerChatRoom;

type DelMarkerEvent = string;

export type WebSocketContextEventMap = {
  newPost: NewPostEvent;
  newChatRoom: NewChatRoomEvent;
  delPost: DelMarkerEvent;
  delChatRoom: DelMarkerEvent;
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
