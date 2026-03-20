import { NextRequest, NextResponse } from 'next/server';
import { getCustomer } from '@/lib/store';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const customer = getCustomer(params.id);

  if (!customer) {
    return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  }

  return NextResponse.json({ customer });
}
