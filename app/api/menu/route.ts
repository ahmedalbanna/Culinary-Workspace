import { NextRequest, NextResponse } from 'next/server';
import { listMenuItems, addMenuItem } from '@/lib/menu-store';
import type { MenuItem } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ items: listMenuItems() });
}

export async function POST(request: NextRequest) {
  const body = await request.json() as Omit<MenuItem, 'id'>;
  const item = addMenuItem(body);
  return NextResponse.json({ item }, { status: 201 });
}
