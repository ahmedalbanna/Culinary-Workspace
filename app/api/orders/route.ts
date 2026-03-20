import { NextResponse } from 'next/server';
import { listOrders, getOrdersSummary } from '@/lib/orders-store';

export async function GET() {
  return NextResponse.json({ orders: listOrders(), summary: getOrdersSummary() });
}
