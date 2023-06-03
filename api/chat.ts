import api, { BASE_URL_WS } from './api';
import { WebSocketMessage } from '@/types/websocket';
import { ChatMessage, ChatMessagePayload } from '@/types/chat';

export const CHAT_ENDPOINT = '/chat';

export async function getMessages() {
  return api.get<ChatMessage[]>('/messages/');
}

export async function postMessage(message: ChatMessagePayload) {
  return api.post<ChatMessage>('/messages/', message);
}

export function connectToChat(
  onMessage: (message: ChatMessage) => void,
  onOpen: (messages: ChatMessage[]) => void,
  onClose: () => void,
) {
  console.log('Connecting to chat...');
  const ws = new WebSocket(`${BASE_URL_WS}${CHAT_ENDPOINT}/`);

  const sendMessage = async (message: ChatMessagePayload) => {
    console.log('Sending message...', message);
    const res = await postMessage(message);
    ws.send(JSON.stringify(res.data));
  };

  const disconnect = () => {
    console.log('Disconnecting from chat...');
    ws.close();
  };

  ws.onmessage = (e: MessageEvent<string>) => {
    console.log('Message received: ', e.data);
    const data = JSON.parse(e.data) as WebSocketMessage;
    const message = JSON.parse(data.message) as ChatMessage;
    onMessage(message);
  };

  ws.onopen = async () => {
    console.log('Connection established!');
    const response = await getMessages();
    onOpen(response.data);
  };
  ws.onclose = () => {
    console.log("Retry connection... (before calling chat's socket closed)");
    onClose();
  };
  ws.onerror = (e) => {
    console.log('Error: ', e);
  };

  return { sendMessage, disconnect };
}
