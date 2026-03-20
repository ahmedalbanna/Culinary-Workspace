'use server';

import { redirect } from 'next/navigation';
import { createReservation, updateReservation } from '@/lib/store';
import { ReservationStatus, TableZone } from '@/lib/types';

export async function createReservationAction(formData: FormData) {
  const guestName = formData.get('guestName') as string;
  const phone = formData.get('phone') as string;
  const partySize = Number(formData.get('partySize'));
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const zone = formData.get('zone') as TableZone;
  const tableLabel = formData.get('tableLabel') as string;
  const occasion = formData.get('occasion') as string;
  const notes = formData.get('notes') as string;
  const source = (formData.get('source') as ReservationStatus) ?? 'phone';

  // Find or use a default customerId
  const customerId = (formData.get('customerId') as string) || 'cust_walk_in';

  const reservation = createReservation({
    customerId,
    guestName: guestName || phone,
    partySize: isNaN(partySize) ? 2 : partySize,
    date: date || new Date().toISOString().split('T')[0],
    time: time || '19:00',
    zone: zone || 'Main Hall',
    tableLabel: tableLabel || 'M1',
    status: 'confirmed',
    occasion: occasion || undefined,
    notes: notes || '',
    source: (source as any) || 'phone',
  });

  redirect(`/reservations/${reservation.id}/success`);
}

export async function updateReservationStatusAction(reservationId: string, status: ReservationStatus) {
  'use server';
  updateReservation(reservationId, { status });
  redirect(`/reservations/${reservationId}`);
}

export async function cancelReservationAction(reservationId: string, _reason: string) {
  'use server';
  updateReservation(reservationId, { status: 'waitlist' });
  redirect(`/reservations`);
}

export async function confirmArrivalAction(reservationId: string) {
  'use server';
  updateReservation(reservationId, { status: 'seated' });
  redirect(`/reservations/${reservationId}`);
}

export async function noShowAction(reservationId: string) {
  'use server';
  updateReservation(reservationId, { status: 'completed' });
  redirect(`/reservations`);
}
