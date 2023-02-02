import { createContext, useState, useEffect, useCallback, useRef } from 'react';

interface WebSocketContextValue {
  connected: boolean;
  error: Event | Error | null;
}

const WebSocketContext = createContext<WebSocketContextValue>({
  connected: false,
  error: null,
});

interface WebSocketProviderProps {
  url: string;
  children: React.ReactNode;
}

const RETRY_DELAY_MS = 1000;

export const WebSocketProvider = ({
  url,
  children,
}: WebSocketProviderProps) => {
  const socket = useRef<WebSocket | null>(null);
  const listeners = useRef<Map<string, Array<(event: Event) => void>>>(
    new Map(),
  );
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<Event | Error | null>(null);

  function addListener(event: string, callback: (event: Event) => void) {
    listeners.current.set(event, [
      ...(listeners.current.get(event) || []),
      callback,
    ]);
  }

  function removeListener(event: string, callback: (event: Event) => void) {
    const currentListeners = listeners.current.get(event) || [];
    const newListeners = currentListeners.filter((l) => l !== callback);
    listeners.current.set(event, newListeners);
  }

  const connect = useCallback(() => {
    const newWebSocket = new WebSocket(url);

    newWebSocket.onopen = () => {
      setConnected(true);
      setError(null);
    };

    newWebSocket.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      listeners.current.get(type)?.forEach((callback) => callback(payload));
    };

    newWebSocket.onerror = (event) => {
      setError(event);
    };

    newWebSocket.onclose = (event: CloseEvent) => {
      setConnected(false);
      if (event.wasClean) return;
      setTimeout(connect, RETRY_DELAY_MS);
    };

    socket.current = newWebSocket;
  }, [url]);

  useEffect(() => {
    connect();

    return () => {
      socket.current?.close();
      socket.current = null;
    };
  }, [connect]);

  return (
    <WebSocketContext.Provider value={{ connected, error }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;
