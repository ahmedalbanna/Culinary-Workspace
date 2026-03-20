'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ReservationSettingsPage() {
  const [saved, setSaved]   = useState(false);
  const [form, setForm]     = useState({
    maxPerSlot:        '6',
    slotDuration:      '90',
    advanceDays:       '30',
    minParty:          '1',
    maxParty:          '12',
    confirmSMS:        true,
    reminderSMS:       true,
    reminderHours:     '2',
    cancelPolicy:      '24',
    noShowFee:         '50',
    waitlistEnabled:   true,
    autoConfirm:       false,
  });

  function set(f: string, v: string | boolean) {
    setForm(prev => ({ ...prev, [f]: v }));
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
          <h2 className="page-title">إعدادات الحجز</h2>
          <p className="page-subtitle">قواعد الحجز والإلغاء والتنبيهات</p>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Capacity */}
        <section className="card p-6 space-y-5">
          <h3 className="title-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">event_available</span>
            سعة الحجوزات
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'maxPerSlot',    label: 'أقصى حجز لكل شريحة زمنية', suffix: 'حجز' },
              { key: 'slotDuration',  label: 'مدة كل شريحة زمنية',        suffix: 'دقيقة' },
              { key: 'advanceDays',   label: 'الحجز المسبق بحد أقصى',     suffix: 'يوم' },
              { key: 'minParty',      label: 'الحد الأدنى لعدد الأفراد',   suffix: 'فرد' },
              { key: 'maxParty',      label: 'الحد الأعلى لعدد الأفراد',   suffix: 'فرد' },
            ].map(f => (
              <div key={f.key} className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant">{f.label}</label>
                <div className="flex items-center input-field p-0 overflow-hidden">
                  <input
                    type="number"
                    min="1"
                    value={(form as any)[f.key]}
                    onChange={e => set(f.key, e.target.value)}
                    className="flex-1 bg-transparent border-none py-3 px-3 focus:ring-0 text-sm"
                    dir="ltr"
                  />
                  <span className="px-3 text-xs text-on-surface-variant border-s border-outline-variant py-3 flex-shrink-0">{f.suffix}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Auto-confirm toggle */}
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
            <div>
              <p className="text-sm font-bold">تأكيد تلقائي للحجوزات</p>
              <p className="text-xs text-on-surface-variant">تأكيد الحجز فور استلامه دون مراجعة يدوية</p>
            </div>
            <button
              type="button"
              onClick={() => set('autoConfirm', !form.autoConfirm)}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                form.autoConfirm ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            >
              <span className={`inline-block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${form.autoConfirm ? '-translate-x-5' : '-translate-x-0'}`} />
            </button>
          </div>

          {/* Waitlist toggle */}
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
            <div>
              <p className="text-sm font-bold">قائمة الانتظار</p>
              <p className="text-xs text-on-surface-variant">السماح بالحجز في قائمة الانتظار عند الامتلاء</p>
            </div>
            <button
              type="button"
              onClick={() => set('waitlistEnabled', !form.waitlistEnabled)}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                form.waitlistEnabled ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            >
              <span className={`inline-block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${form.waitlistEnabled ? '-translate-x-5' : '-translate-x-0'}`} />
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="card p-6 space-y-5">
          <h3 className="title-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">notifications_active</span>
            التنبيهات والإشعارات
          </h3>
          {[
            { key: 'confirmSMS',  label: 'رسالة تأكيد الحجز (SMS)',  sub: 'ترسل فور تأكيد الحجز' },
            { key: 'reminderSMS', label: 'رسالة تذكير قبل الموعد',   sub: `ترسل قبل ${form.reminderHours} ساعة من الموعد` },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
              <div>
                <p className="text-sm font-bold">{n.label}</p>
                <p className="text-xs text-on-surface-variant">{n.sub}</p>
              </div>
              <button
                type="button"
                onClick={() => set(n.key, !(form as any)[n.key])}
                className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                  (form as any)[n.key] ? 'bg-primary' : 'bg-surface-container-highest'
                }`}
              >
                <span className={`inline-block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${(form as any)[n.key] ? '-translate-x-5' : '-translate-x-0'}`} />
              </button>
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-on-surface-variant">وقت إرسال التذكير (قبل الموعد)</label>
            <div className="flex items-center input-field p-0 overflow-hidden w-48">
              <input
                type="number"
                min="1"
                max="48"
                value={form.reminderHours}
                onChange={e => set('reminderHours', e.target.value)}
                className="flex-1 bg-transparent border-none py-3 px-3 focus:ring-0 text-sm"
                dir="ltr"
              />
              <span className="px-3 text-xs text-on-surface-variant border-s border-outline-variant py-3 flex-shrink-0">ساعة</span>
            </div>
          </div>
        </section>

        {/* Cancellation */}
        <section className="card p-6 space-y-5">
          <h3 className="title-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">confirmation_number</span>
            سياسة الإلغاء
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-on-surface-variant">إشعار الإلغاء المطلوب</label>
              <div className="flex items-center input-field p-0 overflow-hidden">
                <input
                  type="number"
                  min="0"
                  value={form.cancelPolicy}
                  onChange={e => set('cancelPolicy', e.target.value)}
                  className="flex-1 bg-transparent border-none py-3 px-3 focus:ring-0 text-sm"
                  dir="ltr"
                />
                <span className="px-3 text-xs text-on-surface-variant border-s border-outline-variant py-3 flex-shrink-0">ساعة</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-on-surface-variant">رسوم عدم الحضور</label>
              <div className="flex items-center input-field p-0 overflow-hidden">
                <input
                  type="number"
                  min="0"
                  value={form.noShowFee}
                  onChange={e => set('noShowFee', e.target.value)}
                  className="flex-1 bg-transparent border-none py-3 px-3 focus:ring-0 text-sm"
                  dir="ltr"
                />
                <span className="px-3 text-xs text-on-surface-variant border-s border-outline-variant py-3 flex-shrink-0">AED</span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <Link href="/settings" className="btn-ghost px-6 py-3 rounded-full">إلغاء</Link>
          <button type="submit" className="btn-primary px-8 py-3 rounded-full">
            {saved
              ? <><span className="material-symbols-outlined text-base">check</span> تم الحفظ</>
              : <><span className="material-symbols-outlined text-base">save</span> حفظ الإعدادات</>
            }
          </button>
        </div>
      </form>
    </div>
  );
}
