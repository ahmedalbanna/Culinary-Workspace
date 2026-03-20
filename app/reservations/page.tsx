import { listReservations, listCustomers } from '@/lib/store';
import Link from 'next/link';
import { ConfirmArrivalButton } from '@/components/reservations/confirm-arrival-button';

const statusLabels: Record<string, string> = { confirmed: 'مؤكد', seated: 'جالس', completed: 'مكتمل', waitlist: 'انتظار' };
const zoneLabels: Record<string, string> = { Patio: 'التراس', Window: 'النوافذ', 'Main Hall': 'القاعة', 'Chef Counter': 'الشيف' };
const statusDot: Record<string, string> = { confirmed: 'bg-green-500', seated: 'bg-primary', completed: 'bg-surface-container-highest', waitlist: 'bg-error' };

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
          {/* View toggle */}
          <div className="flex bg-surface-container rounded-full p-1 gap-1">
            <button className="px-5 py-2 rounded-full bg-surface-container-lowest shadow-card text-sm font-bold text-on-surface">قائمة</button>
            <button className="px-5 py-2 rounded-full text-on-surface-variant text-sm font-medium hover:bg-surface-container-high transition-colors">تقويم</button>
          </div>
          <Link href={'/reservations/new' as any} className="btn-primary">
            <span className="material-symbols-outlined">add</span>
            حجز جديد
          </Link>
        </div>
      </header>

      {/* Filter bar */}
      <div className="card-low p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input type="text" placeholder="ابحث بالاسم أو رقم الهاتف..." className="input-field ps-10 py-2.5 text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['الكل', 'مؤكد', 'جالس', 'مكتمل', 'انتظار'].map((s, i) => (
            <button key={s} className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${i === 0 ? 'bg-primary text-white' : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['confirmed', 'seated', 'completed', 'waitlist'] as const).map(status => (
          <div key={status} className="card p-4 flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full flex-shrink-0 ${statusDot[status]}`} />
            <div>
              <p className="text-xs text-on-surface-variant font-medium">{statusLabels[status]}</p>
              <p className="text-xl font-extrabold">{reservations.filter(r => r.status === status).length}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {reservations.map((res) => {
          const customer = customers.find(c => c.id === res.customerId);
          const isActive = res.status === 'confirmed' || res.status === 'waitlist';
          return (
            <article key={res.id} className="card p-5 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300">
              {/* Top */}
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container text-xl font-black flex-shrink-0">
                    {res.guestName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-on-surface text-base leading-tight">{res.guestName}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${statusDot[res.status]}`} />
                      <span className="text-xs text-on-surface-variant font-medium">{statusLabels[res.status]}</span>
                    </div>
                  </div>
                </div>
                {customer?.tier === 'VIP' && (
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-primary-container text-primary uppercase">VIP</span>
                )}
              </div>

              {/* Detail tiles */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: 'schedule', label: 'الوقت', value: res.time },
                  { icon: 'table_bar', label: 'الطاولة', value: res.tableLabel },
                  { icon: 'groups', label: 'الأفراد', value: `${res.partySize}` },
                  { icon: 'place', label: 'المنطقة', value: zoneLabels[res.zone] ?? res.zone },
                ].map(d => (
                  <div key={d.label} className="bg-surface-container-low rounded-xl p-3">
                    <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">{d.label}</p>
                    <p className="font-bold text-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-sm">{d.icon}</span>
                      {d.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {res.notes && (
                <div className="px-3 py-2 bg-primary-container/20 rounded-xl border-s-4 border-primary">
                  <p className="text-xs italic text-on-surface-variant line-clamp-2">"{res.notes}"</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-outline-variant/30">
                {isActive && <ConfirmArrivalButton reservationId={res.id} />}
                <Link href={`/reservations/${res.id}` as any}
                  className="px-4 py-2.5 rounded-full bg-surface-container text-on-surface-variant text-sm font-bold hover:bg-surface-container-high transition-colors">
                  تفاصيل
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
