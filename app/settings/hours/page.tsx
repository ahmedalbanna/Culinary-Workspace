'use client';

import { useState } from 'react';
import Link from 'next/link';

const DAYS = [
  { key: 'sat', label: 'السبت' },
  { key: 'sun', label: 'الأحد' },
  { key: 'mon', label: 'الإثنين' },
  { key: 'tue', label: 'الثلاثاء' },
  { key: 'wed', label: 'الأربعاء' },
  { key: 'thu', label: 'الخميس' },
  { key: 'fri', label: 'الجمعة' },
];

type DaySchedule = { open: boolean; from: string; to: string };
type Schedule = Record<string, DaySchedule>;

const DEFAULT: Schedule = {
  sat: { open: true,  from: '12:00', to: '00:00' },
  sun: { open: true,  from: '12:00', to: '00:00' },
  mon: { open: true,  from: '12:00', to: '00:00' },
  tue: { open: true,  from: '12:00', to: '00:00' },
  wed: { open: true,  from: '12:00', to: '00:00' },
  thu: { open: true,  from: '12:00', to: '02:00' },
  fri: { open: true,  from: '13:00', to: '02:00' },
};

export default function WorkingHoursPage() {
  const [schedule, setSchedule] = useState<Schedule>(DEFAULT);
  const [saved, setSaved] = useState(false);

  function toggle(day: string) {
    setSchedule(prev => ({ ...prev, [day]: { ...prev[day], open: !prev[day].open } }));
    setSaved(false);
  }
  function setTime(day: string, field: 'from' | 'to', value: string) {
    setSchedule(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <header className="flex items-center gap-4">
        <Link href="/settings" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors">
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        <div>
          <h2 className="page-title">أوقات العمل</h2>
          <p className="page-subtitle">ضبط ساعات الافتتاح والإغلاق لكل يوم</p>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="card divide-y divide-outline-variant/20 overflow-hidden">
          {DAYS.map(day => {
            const s = schedule[day.key];
            return (
              <div key={day.key} className={`p-4 sm:p-5 flex items-center gap-4 transition-colors ${!s.open ? 'opacity-50' : ''}`}>
                {/* Toggle */}
                <button
                  type="button"
                  onClick={() => toggle(day.key)}
                  className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                    s.open ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                >
                  <span className={`inline-block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${s.open ? '-translate-x-5' : '-translate-x-0'}`} />
                </button>

                {/* Day label */}
                <span className="w-20 text-sm font-bold text-on-surface flex-shrink-0">{day.label}</span>

                {/* Time range */}
                {s.open ? (
                  <div className="flex items-center gap-2 flex-1 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
                      <span className="text-[10px] font-bold text-on-surface-variant">من</span>
                      <input
                        type="time"
                        value={s.from}
                        onChange={e => setTime(day.key, 'from', e.target.value)}
                        className="input-field py-2 px-3 text-sm flex-1"
                        dir="ltr"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
                      <span className="text-[10px] font-bold text-on-surface-variant">إلى</span>
                      <input
                        type="time"
                        value={s.to}
                        onChange={e => setTime(day.key, 'to', e.target.value)}
                        className="input-field py-2 px-3 text-sm flex-1"
                        dir="ltr"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-on-surface-variant flex-1">مغلق</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Special notes */}
        <div className="card p-5 space-y-3">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">info</span>
            ملاحظة لأوقات الذروة
          </h3>
          <p className="text-xs text-on-surface-variant">
            يُعتبر الجمعة والسبت من المواسم العالية. تأكد من إتاحة كامل طاقم العمل في هذين اليومين.
          </p>
          <div className="flex gap-2 flex-wrap">
            {['18:00 – 20:00 (ذروة)', '20:00 – 22:00 (أعلى ذروة)', '22:00 – 00:00 (متوسط)'].map(t => (
              <span key={t} className="px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold">{t}</span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/settings" className="btn-ghost px-6 py-3 rounded-full">إلغاء</Link>
          <button type="submit" className="btn-primary px-8 py-3 rounded-full">
            {saved
              ? <><span className="material-symbols-outlined text-base">check</span> تم الحفظ</>
              : <><span className="material-symbols-outlined text-base">save</span> حفظ أوقات العمل</>
            }
          </button>
        </div>
      </form>
    </div>
  );
}
