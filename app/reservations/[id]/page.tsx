import { getReservation, getCustomer } from '@/lib/store';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReservationStatusControl } from '@/components/reservations/status-control';

const zoneLabels: Record<string, string> = {
  'Patio': 'التراس الخارجي',
  'Window': 'منطقة النوافذ',
  'Main Hall': 'القاعة الرئيسية',
  'Chef Counter': 'طاولة الشيف',
};

const statusLabels: Record<string, string> = {
  confirmed: 'مؤكد',
  seated: 'جالس',
  completed: 'مكتمل',
  waitlist: 'قائمة الانتظار',
};

const statusColor: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-800',
  seated: 'bg-primary-container text-on-primary-container',
  completed: 'bg-surface-container text-on-surface-variant',
  waitlist: 'bg-error-container text-error',
};

export default function ReservationDetailPage({ params }: { params: { id: string } }) {
  const reservation = getReservation(params.id);
  if (!reservation) notFound();

  const customer = getCustomer(reservation.customerId);
  const isActive = reservation.status === 'confirmed' || reservation.status === 'waitlist';

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/reservations"
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <div>
            <h2 className="headline-sm text-on-surface">تفاصيل الحجز</h2>
            <p className="body-md text-on-surface-variant">{reservation.date} • {reservation.time}</p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-black uppercase tracking-wider ${statusColor[reservation.status]}`}>
          {statusLabels[reservation.status]}
        </span>
      </header>

      {/* Guest profile */}
      <div className="card surface-container-lowest p-8 flex flex-col items-center text-center gap-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center text-primary text-4xl font-black border-4 border-primary-container">
            {reservation.guestName.charAt(0)}
          </div>
          {customer?.tier === 'VIP' && (
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">VIP</span>
          )}
        </div>
        <div>
          <h3 className="headline-sm">{reservation.guestName}</h3>
          {customer && (
            <p className="label-md text-on-surface-variant mt-1">{customer.orderHistory.length} زيارة سابقة</p>
          )}
        </div>
        {reservation.occasion && (
          <div className="flex items-center gap-2 bg-primary-container/30 px-4 py-2 rounded-full text-primary font-bold">
            <span className="material-symbols-outlined text-sm">celebration</span>
            {reservation.occasion}
          </div>
        )}
      </div>

      {/* Core details bento grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: 'calendar_today', label: 'التاريخ', value: reservation.date },
          { icon: 'schedule', label: 'الوقت', value: reservation.time },
          { icon: 'group', label: 'عدد الأفراد', value: `${reservation.partySize} أفراد` },
          { icon: 'table_bar', label: 'الطاولة', value: `${reservation.tableLabel} — ${zoneLabels[reservation.zone] ?? reservation.zone}` },
        ].map(item => (
          <div key={item.label} className="card surface-container-lowest p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">{item.icon}</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium">{item.label}</p>
              <p className="font-bold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Special requests */}
      {(reservation.notes || customer?.allergies?.filter(a => a !== 'None').length) ? (
        <div className="space-y-3">
          <h4 className="label-md text-on-surface-variant font-bold px-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">priority_high</span>
            طلبات وتنبيهات خاصة
          </h4>
          {reservation.notes && (
            <div className="card surface-container-lowest p-5 border-r-4 border-primary flex items-start gap-4">
              <span className="material-symbols-outlined text-primary">notes</span>
              <div>
                <p className="font-bold text-sm mb-1">ملاحظة</p>
                <p className="text-on-surface-variant text-sm">{reservation.notes}</p>
              </div>
            </div>
          )}
          {customer?.allergies?.filter(a => a !== 'None').map(allergy => (
            <div key={allergy} className="card p-5 border-r-4 border-error flex items-start gap-4" style={{ background: 'rgba(186,26,26,0.06)' }}>
              <span className="material-symbols-outlined text-error">warning</span>
              <div>
                <p className="font-bold text-sm text-error mb-1">حساسية مفرطة</p>
                <p className="text-on-surface-variant text-sm">{allergy}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Customer link */}
      {customer && (
        <div className="card surface-container-lowest p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-black text-xl">
              {customer.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold">{customer.name}</p>
              <p className="text-xs text-on-surface-variant">{customer.phone}</p>
            </div>
          </div>
          <Link href={`/customers/${customer.id}` as any} className="px-5 py-2 rounded-full bg-surface-container text-on-surface-variant text-sm font-bold hover:bg-surface-container-highest transition-colors">
            عرض الملف
          </Link>
        </div>
      )}

      {/* Status control — sticky action sheet */}
      {isActive && (
        <ReservationStatusControl
          reservationId={reservation.id}
          guestName={reservation.guestName}
          tableLabel={reservation.tableLabel}
        />
      )}
    </div>
  );
}
