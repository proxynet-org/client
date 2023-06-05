import { WebSocketMessage, WebSocketPayload } from '@/types/websocket';

export function parseWebSocketMessage<T>(
  response: MessageEvent<string>,
): WebSocketPayload<T> | null {
  try {
    const data = JSON.parse(response.data) as WebSocketMessage;
    return JSON.parse(data.message) as WebSocketPayload<T>;
  } catch (err) {
    return null;
  }
}

export function stringifyWebSocketMessage<T>(type: string, data: T): string {
  const message = JSON.stringify({
    type,
    data,
  });
  return message;
}
