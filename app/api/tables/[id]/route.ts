import { NextRequest, NextResponse } from 'next/server';
import { getTable, updateTable } from '@/lib/store';
import { TableUpdate } from '@/lib/types';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const table = getTable(params.id);
  if (!table) return NextResponse.json({ error: 'Table not found.' }, { status: 404 });
  return NextResponse.json({ table });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = (await request.json()) as TableUpdate;
  const table = updateTable(params.id, body);
  if (!table) return NextResponse.json({ error: 'Table not found.' }, { status: 404 });
  return NextResponse.json({ table });
}
