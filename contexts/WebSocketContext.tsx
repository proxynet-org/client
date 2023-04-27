import {
  createContext,
  useState,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import {
  WebSocketEvent,
  WebSocketMessageEvent,
  WebSocketMessageHandler,
} from '@/types/websocket';

interface WebSocketContextState {
  isConnected: boolean;
}

interface WebSocketContextActions {
  connect: () => void;
  disconnect: () => void;
  addEventListener: <T extends WebSocketEvent>(
    event: T,
    handler: WebSocketMessageHandler<T>,
  ) => void;
  removeEventListener: <T extends WebSocketEvent>(event: T) => void;
}

interface WebSocketContextType
  extends WebSocketContextState,
    WebSocketContextActions {}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  connect: () => {
    throw new Error(`connect is not implemented`);
  },
  disconnect: () => {
    throw new Error(`disconnect is not implemented`);
  },
  addEventListener: (event, handler) => {
    throw new Error(
      `addEventListener for ${event} and ${handler} is not implemented`,
    );
  },
  removeEventListener: (event) => {
    throw new Error(`removeEventListener for ${event} is not implemented`);
  },
});

function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);

  const listeners = useRef<
    Map<WebSocketEvent, WebSocketMessageHandler<WebSocketEvent>>
  >(new Map());

  const ws = useRef<WebSocket>();

  const connect = useCallback(async () => {
    ws.current = new WebSocket('ws://192.168.1.15:8080');
    ws.current.onopen = () => {
      setIsConnected(true);
    };
    ws.current.onclose = () => {
      setIsConnected(false);
    };
    ws.current.onerror = () => {
      setIsConnected(false);
    };
    ws.current.onmessage = (ev: MessageEvent<string>) => {
      const message = JSON.parse(
        ev.data,
      ) as WebSocketMessageEvent<WebSocketEvent>;
      const handler = listeners.current?.get(message.event);
      if (handler) {
        handler(message.data);
      }
    };
  }, []);

  const disconnect = useCallback(async () => {
    ws.current?.close();
  }, []);

  const addEventListener = useCallback(
    <T extends WebSocketEvent>(
      event: T,
      handler: WebSocketMessageHandler<T>,
    ) => {
      if (!listeners.current) {
        listeners.current = new Map();
      }
      listeners.current.set(
        event,
        handler as WebSocketMessageHandler<WebSocketEvent>,
      );
      return {
        abort: () => {
          listeners.current?.delete(event);
        },
      };
    },
    [],
  );

  const removeEventListener = useCallback(
    <T extends WebSocketEvent>(event: T) => {
      listeners.current?.delete(event);
    },
    [],
  );

  const value = useMemo(
    () => ({
      isConnected,
      connect,
      disconnect,
      addEventListener,
      removeEventListener,
    }),
    [isConnected, connect, disconnect, addEventListener, removeEventListener],
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

function useWebSocket() {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error(
      'useWebSocketContext must be used within WebSocketProvider',
    );
  }

  return context;
}

export { WebSocketProvider, useWebSocket };
