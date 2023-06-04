import { BASE_URL_WS } from '@env';
import api from './api';
import { WebSocketMessage } from '@/types/websocket';
import { ChatMessage, ChatMessagePayload } from '@/types/chat';

export const CHAT_ENDPOINT = '/all';
export const MESSAGES_ENDPOINT = '/messages';

export function connectToChat(
  chatEndpoint: string,
  messagesEndpoint: string,
  onMessage: (message: ChatMessage) => void,
  onOpen: () => void,
  onClose: () => void,
) {
  console.log('Connecting to chat...');
  const ws = new WebSocket(`${BASE_URL_WS}${chatEndpoint}/`);

  async function getMessages() {
    console.log('Getting messages...');
    const res = await api.get<ChatMessage[]>(messagesEndpoint);
    console.log('Got messages: ', res.data);
    return res;
  }

  async function sendMessage(message: ChatMessagePayload) {
    console.log('Sending message...', message);
    const res = await api.post<ChatMessage>(`${messagesEndpoint}/`, message);
    ws.send(JSON.stringify(res.data));
  }

  function disconnect() {
    console.log('Disconnecting from chat...');
    ws.close();
  }

  ws.onmessage = (e: MessageEvent<string>) => {
    console.log('Message received: ', e.data);
    const data = JSON.parse(e.data) as WebSocketMessage;
    const message = JSON.parse(data.message) as ChatMessage;
    onMessage(message);
  };

  ws.onopen = async () => {
    console.log('Connection established!');
    onOpen();
  };
  ws.onclose = () => {
    console.log('Connection closed!');
    onClose();
  };
  ws.onerror = (e) => {
    console.log('Error: ', e);
  };

  return { getMessages, sendMessage, disconnect };
}
