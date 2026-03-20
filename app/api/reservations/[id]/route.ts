import { NextRequest, NextResponse } from 'next/server';
import { getReservation, updateReservation } from '@/lib/store';
import { ReservationUpdate } from '@/lib/types';
import { sseBus } from '@/lib/sse-bus';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const reservation = getReservation(params.id);

  if (!reservation) {
    return NextResponse.json({ error: 'Reservation not found.' }, { status: 404 });
  }

  return NextResponse.json({ reservation });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = (await request.json()) as ReservationUpdate;
  const reservation = updateReservation(params.id, body);

  if (!reservation) {
    return NextResponse.json({ error: 'Reservation not found.' }, { status: 404 });
  }

  return NextResponse.json({ reservation });
}
