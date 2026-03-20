import { NextResponse } from 'next/server';
import { sseBus } from '@/lib/sse-bus';

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connected event
      controller.enqueue(encoder.encode('event: connected\ndata: {}\n\n'));

      // Heartbeat every 25 s to keep the connection alive through proxies
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch {
          clearInterval(heartbeat);
        }
      }, 25_000);

      // Subscribe to bus events
      const unsubscribe = sseBus.subscribe((event) => {
        try {
          const data = JSON.stringify(event.payload);
          controller.enqueue(
            encoder.encode(`event: ${event.type}\ndata: ${data}\n\n`)
          );
        } catch {
          // Client disconnected
        }
      });

      // Cleanup on client disconnect
      return () => {
        clearInterval(heartbeat);
        unsubscribe();
      };
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
      Connection: 'keep-alive',
    },
  });
}
