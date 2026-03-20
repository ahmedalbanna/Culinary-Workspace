'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Reservation } from '@/lib/types';

interface Props {
  reservations: Reservation[];
}

const STATUS_COLOR: Record<string, string> = {
  confirmed: 'bg-primary',
  seated:    'bg-green-500',
  completed: 'bg-surface-container-highest',
  waitlist:  'bg-error',
};
const STATUS_LABEL: Record<string, string> = {
  confirmed: 'مؤكد', seated: 'جالس', completed: 'مكتمل', waitlist: 'انتظار',
};
const STATUS_TEXT: Record<string, string> = {
  confirmed: 'text-primary', seated: 'text-green-700', completed: 'text-on-surface-variant', waitlist: 'text-error',
};

// Hours to show on the timeline: 10am – midnight
const TIMELINE_HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToPct(minutes: number): number {
  const start = 10 * 60; // 10:00
  const end   = 24 * 60; // 00:00 = 24:00
  return Math.min(Math.max(((minutes - start) / (end - start)) * 100, 0), 100);
}

const CURRENT_TIME = '20:15'; // Simulated now
const currentMinutes = timeToMinutes(CURRENT_TIME);
const currentPct = minutesToPct(currentMinutes);

export function ReservationTimeline({ reservations }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedRes = reservations.find(r => r.id === selectedId);

  // Group by 2-hour slots for the heatmap row
  const slotCounts: Record<number, number> = {};
  TIMELINE_HOURS.forEach(h => { slotCounts[h] = 0; });
  reservations.forEach(r => {
    const h = parseInt(r.time.split(':')[0]);
    if (slotCounts[h] !== undefined) slotCounts[h]++;
  });
  const maxSlot = Math.max(...Object.values(slotCounts), 1);

  return (
    <div className="space-y-4">
      {/* Heatmap bar */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-on-surface">خريطة حرارة الحجوزات</h3>
          <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            الآن {CURRENT_TIME}
          </span>
        </div>

        {/* Hour grid */}
        <div className="relative">
          {/* Bars */}
          <div className="flex gap-1 items-end h-12">
            {TIMELINE_HOURS.map(h => {
              const count = slotCounts[h];
              const heightPct = (count / maxSlot) * 100;
              const isPeak = count === maxSlot && maxSlot > 0;
              const isPast = h * 60 < currentMinutes - 60;
              return (
                <div key={h} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md transition-all duration-500"
                    style={{
                      height: `${Math.max(heightPct, 8)}%`,
                      background: isPast
                        ? 'rgba(148,74,0,0.15)'
                        : isPeak
                        ? 'linear-gradient(180deg,#944A00,#E67E22)'
                        : `rgba(148,74,0,${0.15 + (heightPct / 100) * 0.7})`,
                    }}
                  />
                  {count > 0 && (
                    <span className="text-[8px] font-black text-on-surface-variant">{count}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current time indicator */}
          <div
            className="absolute top-0 bottom-0 w-px bg-primary/60 z-10"
            style={{ left: `${currentPct}%` }}
          >
            <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 rounded-full bg-primary" />
          </div>
        </div>

        {/* Hour labels */}
        <div className="flex gap-1">
          {TIMELINE_HOURS.map(h => (
            <div key={h} className="flex-1 text-center">
              <span className="text-[8px] text-on-surface-variant font-medium">{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline blocks — visual swim-lane */}
      <div className="card p-5 space-y-3 overflow-hidden">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-on-surface">الجدول الزمني لليوم</h3>
          <Link href="/reservations" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            عرض الكل <span className="material-symbols-outlined text-sm">arrow_back</span>
          </Link>
        </div>

        {/* Relative timeline */}
        <div className="relative mt-2" style={{ height: `${Math.max(reservations.length * 52, 80)}px` }}>
          {/* Hour grid lines */}
          {[12, 14, 16, 18, 20, 22].map(h => (
            <div
              key={h}
              className="absolute top-0 bottom-0 border-s border-outline-variant/20 flex flex-col items-start"
              style={{ left: `${minutesToPct(h * 60)}%` }}
            >
              <span className="text-[9px] text-on-surface-variant/50 -mt-4 ps-1">{h}:00</span>
            </div>
          ))}

          {/* Current time line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary/40 z-10"
            style={{ left: `${currentPct}%` }}
          />

          {/* Reservation blocks */}
          {reservations.slice(0, 8).map((res, idx) => {
            const startMin = timeToMinutes(res.time);
            const durationMin = 90; // assumed 90min per res
            const left = minutesToPct(startMin);
            const width = minutesToPct(startMin + durationMin) - left;
            const isSelected = selectedId === res.id;
            const isHovered  = hoveredId  === res.id;

            return (
              <button
                key={res.id}
                onClick={() => setSelectedId(isSelected ? null : res.id)}
                onMouseEnter={() => setHoveredId(res.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`absolute rounded-xl px-2 py-1.5 text-start transition-all duration-200 cursor-pointer ${
                  isSelected ? 'ring-2 ring-primary ring-offset-1 z-20' : 'z-10'
                } ${isHovered ? 'scale-105 shadow-ambient' : ''}`}
                style={{
                  left: `${left}%`,
                  width: `${Math.max(width, 12)}%`,
                  top: `${idx * 52}px`,
                  background: isSelected
                    ? 'linear-gradient(135deg,#944A00,#E67E22)'
                    : res.status === 'seated'
                    ? 'rgba(34,197,94,0.15)'
                    : 'rgba(148,74,0,0.08)',
                  borderLeft: `3px solid ${
                    res.status === 'confirmed' ? '#944A00'
                    : res.status === 'seated'  ? '#16a34a'
                    : res.status === 'waitlist' ? '#BA1A1A'
                    : '#9ca3af'
                  }`,
                }}
              >
                <p className={`text-[10px] font-black truncate leading-tight ${isSelected ? 'text-white' : 'text-on-surface'}`}>
                  {res.guestName}
                </p>
                <p className={`text-[9px] ${isSelected ? 'text-white/70' : 'text-on-surface-variant'}`}>
                  {res.time} · {res.tableLabel}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected detail popup */}
        {selectedRes && (
          <div className="mt-4 p-4 rounded-2xl bg-primary-container/30 border-s-4 border-primary space-y-2 animate-in fade-in duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-on-surface">{selectedRes.guestName}</p>
                <p className="text-xs text-on-surface-variant">
                  {selectedRes.time} · طاولة {selectedRes.tableLabel} · {selectedRes.partySize} أفراد
                  {selectedRes.occasion ? ` · ${selectedRes.occasion}` : ''}
                </p>
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-full ${STATUS_COLOR[selectedRes.status]} text-white`}>
                {STATUS_LABEL[selectedRes.status]}
              </span>
            </div>
            {selectedRes.notes && (
              <p className="text-xs italic text-on-surface-variant">"{selectedRes.notes}"</p>
            )}
            <Link
              href={`/reservations/${selectedRes.id}` as any}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              فتح التفاصيل <span className="material-symbols-outlined text-sm">arrow_back</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
