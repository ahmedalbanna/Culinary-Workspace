'use client';

import { useSearchParams } from 'next/navigation';
import { ReservationsList } from '@/components/reservations/reservations-list';
import type { Reservation, Customer } from '@/lib/types';

interface Props {
  reservations: Reservation[];
  customers: Customer[];
}

export function ReservationsListSection({ reservations, customers }: Props) {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') ?? 'list';

  if (view === 'calendar') return null;

  return <ReservationsList reservations={reservations} customers={customers} />;
}
