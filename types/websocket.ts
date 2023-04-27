import { Chatroom } from './chatroom';
import { Post } from './post';

export enum WebSocketEvent {
  POST = 'post',
  CHATROOM = 'chatroom',
  CHATROOM_MESSAGE = 'chatroom_message',
  CHAT_ALL = 'chat_all',
}

export type WebSocketMessageData = {
  [WebSocketEvent.POST]: Post;
  [WebSocketEvent.CHATROOM]: Chatroom;
  [WebSocketEvent.CHATROOM_MESSAGE]: string;
  [WebSocketEvent.CHAT_ALL]: string;
};

export type WebSocketMessageEvent<T extends WebSocketEvent> = {
  event: T;
  data: WebSocketMessageData[T];
};

export type WebSocketMessageHandler<T extends WebSocketEvent> = (
  data: WebSocketMessageData[T],
) => void;
