import { NextResponse } from 'next/server';
import { listCustomers } from '@/lib/store';

export async function GET() {
  return NextResponse.json({ customers: listCustomers() });
}
