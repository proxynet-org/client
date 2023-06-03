import { LatLng } from 'react-native-maps';
import { Publication } from '@/types/publications';

import api, { BASE_URL_WS } from './api';

export async function updatePosition(position: LatLng) {
  console.log('Updating position...');
  return api.post('/users/location/', { coordinates: position });
}

export function openMap<T>(
  endpoint: string,
  onData?: (data: T) => void,
  onOpen?: () => void,
  onClose?: () => void,
) {
  console.log('Opening map...');
  const ws = new WebSocket(`${BASE_URL_WS}${endpoint}/`);

  const closeMap = () => {
    console.log('Closing map...');
    ws.close();
  };

  const sendMessage = (data: T) => {
    console.log(`Sending to ${endpoint}`, data);
    ws.send(JSON.stringify(data));
  };

  ws.onmessage = (e: MessageEvent<string>) => {
    const { message } = JSON.parse(e.data);
    const data = JSON.parse(message) as T;
    onData?.(data);
  };

  if (onOpen) ws.onopen = onOpen;
  ws.onclose = () => {
    console.log("Retry connection... (before calling map's socket closed)");
    onClose?.();
  };
  ws.onerror = (e) => {
    console.log('Error: ', e);
  };

  return { closeMap, sendMessage, ws };
}

export function sendPublication(publication: Publication) {
  const { ws, sendMessage, closeMap } = openMap('/publications');

  ws.onopen = () => {
    sendMessage(publication);
    closeMap();
  };
}
