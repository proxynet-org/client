import { BASE_URL_WS } from './api';

export const CHAT_ENDPOINT = '/chat';

export function connectToChat(
  onMessage: (message: string) => void,
  onOpen: () => void,
  onClose: () => void,
) {
  console.log('Connecting to chat...');
  const ws = new WebSocket(`${BASE_URL_WS}${CHAT_ENDPOINT}`);

  const sendMessage = (message: string) => {
    console.log('Sending message...', message);
    ws.send(
      JSON.stringify({
        message,
      }),
    );
  };

  const disconnect = () => {
    console.log('Disconnecting from chat...');
    ws.close();
  };

  ws.onmessage = (e: MessageEvent<string>) => {
    console.log('Message received: ', e.data);
    const data = JSON.parse(e.data);
    onMessage(data);
  };

  ws.onopen = onOpen;
  ws.onclose = () => {
    console.log("Retry connection... (before calling chat's socket closed)");
    onClose();
  };
  ws.onerror = (e) => {
    console.log('Error: ', e);
  };

  return { sendMessage, disconnect };
}
