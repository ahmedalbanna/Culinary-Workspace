import { NextRequest, NextResponse } from 'next/server';
import { getOrder, updateOrderStatus, updateOrderItems, addOrderItem } from '@/lib/orders-store';
import type { OrderStatus, OrderLineItem } from '@/lib/types';
import { sseBus } from '@/lib/sse-bus';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const order = getOrder(params.id);
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json() as {
    status?: OrderStatus;
    paymentMethod?: string;
    items?: OrderLineItem[];
    addItem?: Omit<OrderLineItem, 'id'>;
  };

  let order;
  if (body.items) {
    order = updateOrderItems(params.id, body.items);
  } else if (body.addItem) {
    order = addOrderItem(params.id, body.addItem);
  } else if (body.status) {
    order = updateOrderStatus(params.id, body.status);
  }

  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  sseBus.emit({ type: 'order:updated', payload: order });
  return NextResponse.json({ order });
}
