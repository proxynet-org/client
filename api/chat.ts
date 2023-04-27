import api from './api';

export default function connectToChat(onMessage: (message: string) => void) {
  const ws = new WebSocket(
    `ws://${api.defaults.baseURL?.replace('http://', '')}/ws/chat`,
  );

  const sendMessage = (message: string) => {
    ws.send(
      JSON.stringify({
        message,
      }),
    );
  };

  const disconnect = () => {
    ws.close();
  };

  ws.onmessage = (e: MessageEvent<string>) => {
    const data = JSON.parse(e.data);
    onMessage(data);
  };

  ws.onopen = () => {
    console.log('connected');
  };

  ws.onclose = () => {
    console.log('disconnected');
  };

  return { sendMessage, disconnect };
}
