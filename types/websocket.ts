export type WebSocketMessage = {
  message: string;
};

export type WebSocketPayload<T> = {
  type: string;
  data: T;
};
