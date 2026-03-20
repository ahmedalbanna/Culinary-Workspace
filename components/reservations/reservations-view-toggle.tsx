'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { CalendarView } from '@/components/reservations/calendar-view';
import type { Reservation } from '@/lib/types';

interface Props {
  reservations: Reservation[];
}

export function ReservationsViewToggle({ reservations }: Props) {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const view         = searchParams.get('view') ?? 'list';

  function setView(v: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', v);
    router.replace(`/reservations?${params.toString()}`);
  }

  return (
    <>
      <div className="flex bg-surface-container rounded-full p-1 gap-1">
        <button
          onClick={() => setView('list')}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
            view !== 'calendar'
              ? 'bg-surface-container-lowest shadow-sm text-on-surface'
              : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          قائمة
        </button>
        <button
          onClick={() => setView('calendar')}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
            view === 'calendar'
              ? 'bg-surface-container-lowest shadow-sm text-on-surface'
              : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          تقويم
        </button>
      </div>
      {view === 'calendar' && (
        <div className="w-screen max-w-[calc(100vw-2rem)] lg:w-auto" style={{ position: 'absolute', display: 'none' }} />
      )}
    </>
  );
}

export function CalendarSection({ reservations }: Props) {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') ?? 'list';
  if (view !== 'calendar') return null;
  return <CalendarView reservations={reservations} />;
}
