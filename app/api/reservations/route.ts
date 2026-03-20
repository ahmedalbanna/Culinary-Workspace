import { NextRequest, NextResponse } from 'next/server';
import { createReservation, listReservations } from '@/lib/store';
import { ReservationInput } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ reservations: listReservations() });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<ReservationInput>;

  if (!body.customerId || !body.guestName || !body.partySize || !body.date || !body.time || !body.zone || !body.tableLabel || !body.status || !body.source) {
    return NextResponse.json({ error: 'Missing required reservation fields.' }, { status: 400 });
  }

  const reservation = createReservation({
    customerId: body.customerId,
    guestName: body.guestName,
    partySize: Number(body.partySize),
    date: body.date,
    time: body.time,
    zone: body.zone,
    tableLabel: body.tableLabel,
    status: body.status,
    source: body.source,
    occasion: body.occasion,
    notes: body.notes,
  });

  return NextResponse.json({ reservation }, { status: 201 });
}
