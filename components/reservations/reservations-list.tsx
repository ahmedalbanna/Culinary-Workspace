'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Reservation, Customer } from '@/lib/types';
import { ConfirmArrivalButton } from '@/components/reservations/confirm-arrival-button';

const statusLabels: Record<string, string> = { confirmed: 'مؤكد', seated: 'جالس', completed: 'مكتمل', waitlist: 'انتظار' };
const zoneLabels: Record<string, string> = { Patio: 'التراس', Window: 'النوافذ', 'Main Hall': 'القاعة', 'Chef Counter': 'الشيف' };
const statusDot: Record<string, string> = { confirmed: 'bg-green-500', seated: 'bg-primary', completed: 'bg-surface-container-highest', waitlist: 'bg-error' };

const FILTERS = ['الكل', 'مؤكد', 'جالس', 'مكتمل', 'انتظار'] as const;
const FILTER_MAP: Record<string, string> = { 'مؤكد': 'confirmed', 'جالس': 'seated', 'مكتمل': 'completed', 'انتظار': 'waitlist' };

interface Props {
  reservations: Reservation[];
  customers: Customer[];
}

export function ReservationsList({ reservations, customers }: Props) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('الكل');

  const filtered = useMemo(() => {
    let list = reservations;
    if (activeFilter !== 'الكل') {
      const statusKey = FILTER_MAP[activeFilter];
      list = list.filter(r => r.status === statusKey);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(r =>
        r.guestName.toLowerCase().includes(q) ||
        r.tableLabel?.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [reservations, search, activeFilter]);

  return (
    <>
      {/* Filter bar */}
      <div className="card-low p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو رقم الهاتف..."
            className="input-field ps-10 py-2.5 text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setActiveFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                activeFilter === s
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {s}
              {s !== 'الكل' && (
                <span className="mr-1 opacity-70">
                  ({reservations.filter(r => r.status === FILTER_MAP[s]).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['confirmed', 'seated', 'completed', 'waitlist'] as const).map(status => (
          <button
            key={status}
            onClick={() => setActiveFilter(statusLabels[status])}
            className={`card p-4 flex items-center gap-3 w-full text-right transition-all hover:-translate-y-0.5 ${
              activeFilter === statusLabels[status] ? 'ring-2 ring-primary' : ''
            }`}
          >
            <span className={`w-3 h-3 rounded-full flex-shrink-0 ${statusDot[status]}`} />
            <div>
              <p className="text-xs text-on-surface-variant font-medium">{statusLabels[status]}</p>
              <p className="text-xl font-extrabold">{reservations.filter(r => r.status === status).length}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Results count */}
      {(search || activeFilter !== 'الكل') && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-on-surface-variant">
            عرض <span className="font-bold text-on-surface">{filtered.length}</span> من {reservations.length} حجز
          </p>
          <button
            onClick={() => { setSearch(''); setActiveFilter('الكل'); }}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">close</span>
            مسح الفلتر
          </button>
        </div>
      )}

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-3">search_off</span>
          <p className="text-on-surface-variant">لا توجد حجوزات تطابق بحثك</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((res) => {
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
                  <Link
                    href={`/reservations/${res.id}` as any}
                    className="px-4 py-2.5 rounded-full bg-surface-container text-on-surface-variant text-sm font-bold hover:bg-surface-container-high transition-colors"
                  >
                    تفاصيل
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
