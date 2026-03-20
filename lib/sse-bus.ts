/**
 * In-process SSE event bus.
 * Works across Next.js server renders in dev because the Node.js process is
 * persistent. In production serverless this resets on cold starts — acceptable
 * for a development-stage MVP.
 */

export type SSEEventType =
  | 'table:updated'
  | 'order:updated'
  | 'reservation:updated';

export interface SSEEvent {
  type: SSEEventType;
  payload: unknown;
}

type Subscriber = (event: SSEEvent) => void;

declare global {
  // eslint-disable-next-line no-var
  var __culinarySSEBus:
    | {
        subscribers: Set<Subscriber>;
        emit: (event: SSEEvent) => void;
        subscribe: (fn: Subscriber) => () => void;
      }
    | undefined;
}

if (!globalThis.__culinarySSEBus) {
  const subscribers = new Set<Subscriber>();

  globalThis.__culinarySSEBus = {
    subscribers,
    emit(event: SSEEvent) {
      for (const sub of subscribers) {
        try { sub(event); } catch { /* ignore disconnected clients */ }
      }
    },
    subscribe(fn: Subscriber) {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
  };
}

export const sseBus = globalThis.__culinarySSEBus;
