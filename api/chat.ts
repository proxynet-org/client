import { BASE_URL_WS } from '@env';
import api from './api';
import { ChatMessage, ChatMessagePayload } from '@/types/chat';
import {
  parseWebSocketMessage,
  stringifyWebSocketMessage,
} from '@/utils/websocket';

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
    ws.send(stringifyWebSocketMessage('message', res.data));
  }

  function disconnect() {
    console.log('Disconnecting from chat...');
    ws.close();
  }

  ws.onmessage = (event) => {
    console.log('Message received: ', event.data);
    const data = parseWebSocketMessage<ChatMessage>(event);
    if (data && data.type === 'message') {
      onMessage(data.data);
    }
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
