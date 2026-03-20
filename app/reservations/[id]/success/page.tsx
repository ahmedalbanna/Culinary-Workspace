import { getReservation, getCustomer } from '@/lib/store';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const zoneLabels: Record<string, string> = {
  'Patio': 'التراس الخارجي',
  'Window': 'منطقة النوافذ',
  'Main Hall': 'القاعة الرئيسية',
  'Chef Counter': 'طاولة الشيف',
};

export default function ReservationSuccessPage({ params }: { params: { id: string } }) {
  const reservation = getReservation(params.id);
  if (!reservation) notFound();

  const customer = getCustomer(reservation.customerId);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Success animation ring */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full opacity-20 blur-2xl" style={{ background: 'linear-gradient(135deg, #944A00, #E67E22)' }} />
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #944A00, #E67E22)' }}>
              <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="display-md">تم الحجز!</h2>
          <p className="body-md text-on-surface-variant">تم تأكيد الحجز وإضافته إلى سجل الحجوزات بنجاح.</p>
        </div>

        {/* Reservation summary card */}
        <div className="card surface-container-lowest p-6 text-right space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-outline-variant">
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary font-black text-xl">
              {reservation.guestName.charAt(0)}
            </div>
            <div>
              <p className="font-bold">{reservation.guestName}</p>
              {customer && <p className="text-xs text-on-surface-variant">{customer.tier}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: 'calendar_today', label: 'التاريخ', value: reservation.date },
              { icon: 'schedule', label: 'الوقت', value: reservation.time },
              { icon: 'groups', label: 'الأفراد', value: `${reservation.partySize} أفراد` },
              { icon: 'table_bar', label: 'الطاولة', value: `${reservation.tableLabel} — ${zoneLabels[reservation.zone] ?? reservation.zone}` },
            ].map(item => (
              <div key={item.label} className="bg-surface-container-low p-3 rounded-xl">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">{item.label}</p>
                <p className="font-bold text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary">{item.icon}</span>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {reservation.occasion && (
            <div className="flex items-center gap-2 bg-primary-container/30 px-4 py-2 rounded-full text-primary font-bold text-sm">
              <span className="material-symbols-outlined text-sm">celebration</span>
              {reservation.occasion}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link href={`/reservations/${reservation.id}` as any} className="btn-primary justify-center py-4">
            <span className="material-symbols-outlined">event_available</span>
            عرض تفاصيل الحجز
          </Link>
          <Link href={"/reservations/new" as any} className="btn-secondary flex justify-center py-4">
            إضافة حجز آخر
          </Link>
          <Link href="/" className="py-3 text-on-surface-variant font-bold hover:text-primary transition-colors">
            العودة إلى الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
