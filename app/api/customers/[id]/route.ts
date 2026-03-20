import { NextRequest, NextResponse } from 'next/server';
import { getCustomer, updateCustomer } from '@/lib/store';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const customer = getCustomer(params.id);
  if (!customer) return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  return NextResponse.json({ customer });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const customer = updateCustomer(params.id, body);
  if (!customer) return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  return NextResponse.json({ customer });
}
