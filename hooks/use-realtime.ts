'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { SSEEventType } from '@/lib/sse-bus';

type EventHandler<T = unknown> = (payload: T) => void;

type HandlerMap = Partial<Record<SSEEventType, EventHandler<any>>>;

/**
 * useRealtime — subscribes to /api/events and calls the provided handlers
 * whenever a matching SSE event arrives. Reconnects automatically on error.
 */
export function useRealtime(handlers: HandlerMap) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const connect = useCallback(() => {
    const es = new EventSource('/api/events');

    const eventTypes: SSEEventType[] = [
      'table:updated',
      'order:updated',
      'reservation:updated',
    ];

    for (const type of eventTypes) {
      es.addEventListener(type, (e: MessageEvent) => {
        const handler = handlersRef.current[type];
        if (handler) {
          try {
            handler(JSON.parse(e.data));
          } catch { /* ignore parse errors */ }
        }
      });
    }

    es.onerror = () => {
      es.close();
      // Reconnect after 3 s
      setTimeout(connect, 3_000);
    };

    return es;
  }, []);

  useEffect(() => {
    const es = connect();
    return () => es.close();
  }, [connect]);
}
