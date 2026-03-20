import { NextRequest, NextResponse } from 'next/server';
import { getMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/menu-store';
import type { MenuItemUpdate } from '@/lib/types';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const item = getMenuItem(params.id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json() as MenuItemUpdate;
  const item = updateMenuItem(params.id, body);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const ok = deleteMenuItem(params.id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
