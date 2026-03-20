'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Reservation } from '@/lib/types';

interface Props {
  reservations: Reservation[];
}

const STATUS_COLOR: Record<string, string> = {
  confirmed: 'bg-primary',
  seated:    'bg-primary-container',
  completed: 'bg-surface-container-highest',
  waitlist:  'bg-error',
};
const STATUS_LABEL: Record<string, string> = { confirmed: 'مؤكد', seated: 'جالس', completed: 'مكتمل', waitlist: 'انتظار' };

const DAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
}

export function CalendarView({ reservations }: Props) {
  const today = new Date('2026-03-20');
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  }

  const daysInMonth   = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfMonth(year, month);

  // Map reservations to dates in this month
  const paddedMonth = String(month + 1).padStart(2, '0');
  const monthPrefix = `${year}-${paddedMonth}`;

  function resByDay(day: number) {
    const d = String(day).padStart(2, '0');
    return reservations.filter(r => r.date === `${monthPrefix}-${d}`);
  }

  const selectedDateStr = selectedDay != null
    ? `${monthPrefix}-${String(selectedDay).padStart(2, '0')}`
    : null;
  const selectedReservations = selectedDateStr
    ? reservations.filter(r => r.date === selectedDateStr)
    : [];

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // VIP count this month
  const monthVIP = reservations.filter(r => r.date.startsWith(monthPrefix)).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Calendar card — 2 cols */}
      <div className="lg:col-span-2 card p-6 space-y-6">
        {/* Month nav */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-on-surface">{MONTHS_AR[month]} {year}</h3>
            <p className="text-sm text-on-surface-variant">{monthVIP} حجز مؤكد هذا الشهر</p>
          </div>
          <div className="flex gap-2">
            <button onClick={nextMonth} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors text-primary">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
            <button onClick={prevMonth} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors text-primary">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 text-center">
          {DAYS_AR.map(d => (
            <div key={d} className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-wider pb-3">{d.slice(0, 2)}</div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-y-2 text-center">
          {/* Empty cells for first week offset */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14" />
          ))}
          {/* Day cells */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const dayRecs     = resByDay(day);
            const dayStr      = `${monthPrefix}-${String(day).padStart(2, '0')}`;
            const isToday     = dayStr === todayStr;
            const isSelected  = day === selectedDay;
            const hasRecs     = dayRecs.length > 0;

            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`h-14 flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all relative group
                  ${isSelected ? 'bg-primary-fixed/40 ring-2 ring-primary' : 'hover:bg-surface-container-low'}
                  ${isToday && !isSelected ? 'font-black text-primary' : ''}
                `}
              >
                <span className={`text-sm ${isSelected ? 'text-primary font-black' : isToday ? 'text-primary font-black' : 'font-medium'}`}>
                  {day}
                </span>
                {hasRecs && (
                  <div className="flex gap-0.5 mt-1">
                    {dayRecs.slice(0, 3).map((r, idx) => (
                      <span key={idx} className={`w-1.5 h-1.5 rounded-full ${STATUS_COLOR[r.status]}`} />
                    ))}
                    {dayRecs.length > 3 && <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/30" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 flex-wrap pt-2">
          {(['confirmed', 'seated', 'waitlist'] as const).map(s => (
            <span key={s} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <span className={`w-2 h-2 rounded-full ${STATUS_COLOR[s]}`} />
              {STATUS_LABEL[s]}
            </span>
          ))}
        </div>
      </div>

      {/* Day detail panel — 1 col */}
      <div className="space-y-4">
        {/* Summary card */}
        <div className="card p-6 space-y-4" style={{ background: 'rgba(255,220,197,0.3)' }}>
          <h4 className="text-sm font-black text-on-surface-variant">
            {selectedDay != null
              ? `ملخص ${selectedDay} ${MONTHS_AR[month]}`
              : 'اختر يوماً من التقويم'}
          </h4>
          {selectedDay != null && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">إجمالي الحجوزات</span>
                <span className="text-2xl font-black text-primary">{selectedReservations.length}</span>
              </div>
              <div className="w-full bg-white/50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${Math.min((selectedReservations.length / 10) * 100, 100)}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-white rounded-2xl p-3">
                  <p className="text-[10px] text-secondary font-black uppercase">VIP</p>
                  <p className="text-xl font-black text-primary">{selectedReservations.filter(r => r.occasion).length.toString().padStart(2, '0')}</p>
                </div>
                <div className="bg-white rounded-2xl p-3">
                  <p className="text-[10px] text-secondary font-black uppercase">عادي</p>
                  <p className="text-xl font-black text-on-surface">{selectedReservations.filter(r => !r.occasion).length.toString().padStart(2, '0')}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Peak hours bar chart */}
        <div className="card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">local_fire_department</span>
            <h4 className="text-sm font-bold">ساعات الذروة المتوقعة</h4>
          </div>
          <div className="flex items-end gap-1.5 h-16">
            {[25, 40, 100, 80, 50, 30].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md transition-all"
                style={{
                  height: `${h}%`,
                  background: h === 100
                    ? 'linear-gradient(180deg,#944A00,#E67E22)'
                    : `rgba(148,74,0,${h / 200 + 0.1})`,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-on-surface-variant font-bold">
            <span>18:00</span><span>20:00</span><span>22:00</span>
          </div>
        </div>

        {/* Day timeline */}
        {selectedReservations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-on-surface">
              جدول الحجوزات — {selectedDay} {MONTHS_AR[month]}
            </h4>
            {selectedReservations.map(res => (
              <Link
                key={res.id}
                href={`/reservations/${res.id}` as any}
                className="card p-4 flex items-center gap-4 hover:-translate-y-px transition-all border-s-4 border-primary group block"
              >
                <div className="text-center min-w-[48px]">
                  <p className="text-sm font-black text-primary">{res.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{res.guestName}</p>
                  <p className="text-xs text-on-surface-variant">طاولة {res.tableLabel} · {res.partySize} أفراد{res.occasion ? ` · ${res.occasion}` : ''}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${STATUS_COLOR[res.status] === 'bg-primary' ? 'bg-green-100 text-green-700' : 'bg-surface-container text-on-surface-variant'}`}>
                  {STATUS_LABEL[res.status]}
                </span>
              </Link>
            ))}
          </div>
        )}

        {selectedDay != null && selectedReservations.length === 0 && (
          <div className="card p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 block mb-2">event_available</span>
            <p className="text-sm text-on-surface-variant">لا توجد حجوزات في هذا اليوم</p>
            <Link href={'/reservations/new' as any} className="btn-primary text-sm mt-4 inline-flex">
              <span className="material-symbols-outlined text-base">add</span>
              حجز جديد
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
