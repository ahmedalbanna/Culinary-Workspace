import { getTable, getReservation, getCustomer } from '@/lib/store';
import { TableStatusControl } from '@/components/tables/table-status-control';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const ZONE_LABELS: Record<string, string> = {
  Patio: 'التراس الخارجي',
  Window: 'منطقة النوافذ',
  'Main Hall': 'القاعة الرئيسية',
  'Chef Counter': 'طاولة الشيف',
};

const STATUS_LABELS: Record<string, string> = {
  available: 'متاحة',
  occupied: 'مشغولة',
  reserved: 'محجوزة',
  'needs-cleaning': 'تحتاج تنظيف',
  closed: 'مغلقة',
};

const STATUS_COLOR: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  occupied: 'bg-primary-container text-on-primary-container',
  reserved: 'bg-amber-100 text-amber-800',
  'needs-cleaning': 'bg-zinc-100 text-zinc-600',
  closed: 'bg-zinc-50 text-zinc-400',
};

export default function TableDetailPage({ params }: { params: { id: string } }) {
  const table = getTable(params.id);
  if (!table) notFound();

  const reservation = table.currentReservationId ? getReservation(table.currentReservationId) : undefined;
  const customer = reservation ? getCustomer(reservation.customerId) : undefined;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/tables"
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <div>
            <h2 className="headline-sm">طاولة {table.label}</h2>
            <p className="body-md text-on-surface-variant">{ZONE_LABELS[table.zone]} • {table.seats} مقاعد</p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-black ${STATUS_COLOR[table.status]}`}>
          {STATUS_LABELS[table.status]}
        </span>
      </header>

      {/* Hero table card */}
      <div
        className="card p-10 flex flex-col items-center justify-center gap-6 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(148,74,0,0.08), rgba(230,126,34,0.06))' }}
      >
        <div className={`relative flex items-center justify-center bg-white shadow-lg ${table.shape === 'round' ? 'w-28 h-28 rounded-full' : table.shape === 'square' ? 'w-28 h-28 rounded-3xl' : 'w-40 h-20 rounded-3xl'}`}>
          <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            table_restaurant
          </span>
          {table.status === 'occupied' && (
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary ring-4 ring-white animate-pulse" />
          )}
        </div>
        <div>
          <h3 className="display-md">{table.label}</h3>
          <p className="body-md text-on-surface-variant">{table.seats} مقاعد • {table.shape === 'round' ? 'دائرية' : table.shape === 'square' ? 'مربعة' : 'مستطيلة'}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card surface-container-lowest p-5">
          <p className="text-xs text-on-surface-variant mb-1">المنطقة</p>
          <p className="font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary">place</span>
            {ZONE_LABELS[table.zone]}
          </p>
        </div>
        <div className="card surface-container-lowest p-5">
          <p className="text-xs text-on-surface-variant mb-1">عدد المقاعد</p>
          <p className="font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary">event_seat</span>
            {table.seats} مقاعد
          </p>
        </div>
        {table.seatedAt && (
          <div className="card surface-container-lowest p-5">
            <p className="text-xs text-on-surface-variant mb-1">وقت الجلوس</p>
            <p className="font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary">login</span>
              {table.seatedAt}
            </p>
          </div>
        )}
        {table.estimatedTurnover && (
          <div className="card surface-container-lowest p-5">
            <p className="text-xs text-on-surface-variant mb-1">وقت التحرير المتوقع</p>
            <p className="font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary">schedule</span>
              {table.estimatedTurnover}
            </p>
          </div>
        )}
      </div>

      {/* Linked reservation */}
      {reservation && (
        <div className="card surface-container-lowest p-6 space-y-4">
          <h3 className="title-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">event_available</span>
            الحجز المرتبط
          </h3>
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary font-black text-xl">
                {reservation.guestName.charAt(0)}
              </div>
              <div>
                <p className="font-bold">{reservation.guestName}</p>
                <p className="text-xs text-on-surface-variant">
                  {reservation.time} • {reservation.partySize} أفراد
                  {reservation.occasion ? ` • ${reservation.occasion}` : ''}
                </p>
              </div>
            </div>
            <Link
              href={`/reservations/${reservation.id}` as any}
              className="px-4 py-2 rounded-full bg-surface-container text-sm font-bold hover:bg-surface-container-highest transition-colors"
            >
              التفاصيل
            </Link>
          </div>

          {/* Guest allergy warning */}
          {customer?.allergies?.filter(a => a !== 'None').map(allergy => (
            <div key={allergy} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(186,26,26,0.08)' }}>
              <span className="material-symbols-outlined text-error">warning</span>
              <p className="text-sm font-bold text-error">تنبيه حساسية: {allergy}</p>
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      {table.notes && (
        <div className="card surface-container-lowest p-6 border-r-4 border-primary">
          <p className="text-xs text-on-surface-variant mb-2">ملاحظات</p>
          <p className="body-md">{table.notes}</p>
        </div>
      )}

      {/* Status control panel */}
      <TableStatusControl table={table} />
    </div>
  );
}
