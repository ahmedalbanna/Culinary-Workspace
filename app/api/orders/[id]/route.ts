import { NextRequest, NextResponse } from 'next/server';
import { getOrder, updateOrderStatus } from '@/lib/orders-store';
import type { OrderStatus } from '@/lib/types';
import { sseBus } from '@/lib/sse-bus';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const order = getOrder(params.id);
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json() as { status: OrderStatus; paymentMethod?: string };
  const order = updateOrderStatus(params.id, body.status);
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Broadcast to all connected SSE clients
  sseBus.emit({ type: 'order:updated', payload: order });

  return NextResponse.json({ order });
}
