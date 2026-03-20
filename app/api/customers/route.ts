import { NextResponse } from 'next/server';
import { listCustomers, createCustomer } from '@/lib/store';

export async function GET() {
  return NextResponse.json({ customers: listCustomers() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, phone, email, tier, notes, birthday } = body;
  if (!name || !phone) {
    return NextResponse.json({ error: 'الاسم ورقم الجوال مطلوبان' }, { status: 400 });
  }
  const customer = createCustomer({ name, phone: `+966${phone.replace(/^(\+966|0)/, '')}`, email: email ?? '', tier: tier ?? 'New', notes: notes ?? '', birthday });
  return NextResponse.json(customer, { status: 201 });
}
