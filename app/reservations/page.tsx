import { listReservations, listCustomers } from '@/lib/store';
import Link from 'next/link';
import { Suspense } from 'react';
import { ReservationsViewToggle, CalendarSection } from '@/components/reservations/reservations-view-toggle';
import { ReservationsListSection } from '@/components/reservations/reservations-list-section';

export default function ReservationsPage() {
  const reservations = listReservations();
  const customers = listCustomers();

  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      {/* Header */}
      <header className="page-header">
        <div>
          <h2 className="page-title">الحجوزات</h2>
          <p className="page-subtitle">إدارة جميع الحجوزات والمواعيد</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Suspense fallback={null}>
            <ReservationsViewToggle reservations={reservations} />
          </Suspense>
          <Link href={'/reservations/new' as any} className="btn-primary">
            <span className="material-symbols-outlined">add</span>
            حجز جديد
          </Link>
        </div>
      </header>

      {/* Calendar view (only when ?view=calendar) */}
      <Suspense fallback={null}>
        <CalendarSection reservations={reservations} />
      </Suspense>

      {/* List view (hidden when calendar is active — toggled by client component) */}
      <Suspense fallback={null}>
        <ReservationsListSection reservations={reservations} customers={customers} />
      </Suspense>
    </div>
  );
}
