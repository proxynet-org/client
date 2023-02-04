import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { WebSocketContext, WebSocketContextEventMap } from 'contexts';

const RETRY_DELAY_MS = 1000;
const WS_URL = 'ws://localhost:3000';

type WebSocketMessageEvent = {
  name: keyof WebSocketContextEventMap;
  payload: WebSocketContextEventMap[keyof WebSocketContextEventMap];
};

type WebSocketCallbackMap = Map<
  keyof WebSocketContextEventMap,
  Set<(event: any) => void>
>;

type Props = {
  userToken?: string | null;
  children: React.ReactNode;
};

export const WebSocketProvider = ({ userToken, children }: Props) => {
  const ws = useRef<WebSocket | null>(null);
  const callbacks = useRef<WebSocketCallbackMap>(new Map());
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<Event | Error | null>(null);

  const addCallback = useCallback(
    <K extends keyof WebSocketContextEventMap>(
      event: K,
      callback: (event: WebSocketContextEventMap[K]) => void,
    ) => {
      if (!callbacks.current.has(event)) {
        callbacks.current.set(event, new Set());
      }

      console.log('adding callback', event, callback);
      callbacks.current.get(event)?.add(callback);
      console.log('callbacks', callbacks.current);
    },
    [],
  );

  const removeCallback = useCallback(
    <K extends keyof WebSocketContextEventMap>(
      event: K,
      callback: (event: WebSocketContextEventMap[K]) => void,
    ) => {
      if (!callbacks.current.has(event)) return;

      console.log('removing callback', event, callback);
      callbacks.current.get(event)?.delete(callback);
      if (callbacks.current.get(event)?.size === 0) {
        callbacks.current.delete(event);
      }
      console.log('callbacks', callbacks.current);
    },
    [],
  );

  const connect = useCallback((userToken: string) => {
    if (ws.current?.OPEN) return;

    console.log('connecting...');
    return;

    const newWS = new WebSocket(`${WS_URL}?token=${userToken}`);

    newWS.onopen = () => {
      setConnected(true);
      setError(null);
    };

    newWS.onmessage = (event: MessageEvent<WebSocketMessageEvent>) => {
      const { name, payload } = event.data;

      if (!callbacks.current.has(name)) return;

      callbacks.current.get(name)?.forEach((callback) => {
        callback(payload);
      });
    };

    newWS.onerror = (event) => {
      setError(event);
    };

    newWS.onclose = (event: CloseEvent) => {
      setConnected(false);
      if (event.wasClean) return;
      setTimeout(connect, RETRY_DELAY_MS);
    };

    ws.current = newWS;
  }, []);

  const disconnect = useCallback(() => {
    console.log('disconnecting...');
    ws.current?.close();
  }, []);

  useEffect(() => {
    if (userToken) {
      connect(userToken);
      return () => {
        disconnect();
      };
    }
  }, [userToken, connect, disconnect]);

  const value = useMemo(
    () => ({
      connected,
      error,
      addCallback,
      removeCallback,
      connect,
      disconnect,
    }),
    [connected, error, addCallback, removeCallback, connect, disconnect],
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
