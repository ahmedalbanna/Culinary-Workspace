'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RestaurantSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "مطعم سافرون",
    nameEn: "Saffron Restaurant",
    phone: "+971 4 123 4567",
    email: "info@saffron.ae",
    address: "دبي، شارع الشيخ زايد، برج المارينا، الطابق 3",
    capacity: "80",
    currency: "AED",
    timezone: "Asia/Dubai",
    lang: "ar",
  });

  function set(f: string, v: string) {
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
          <h2 className="page-title">إعدادات المطعم</h2>
          <p className="page-subtitle">معلومات الفرع، اللغة، والعملة</p>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic info */}
        <section className="card p-6 space-y-5">
          <h3 className="title-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">store</span>
            معلومات الفرع
          </h3>
          {[
            { key: 'name', label: 'اسم المطعم (عربي)', placeholder: 'مطعم سافرون' },
            { key: 'nameEn', label: 'اسم المطعم (إنجليزي)', placeholder: 'Saffron Restaurant', dir: 'ltr' },
            { key: 'phone', label: 'رقم الهاتف', placeholder: '+971 4 123 4567', dir: 'ltr' },
            { key: 'email', label: 'البريد الإلكتروني', placeholder: 'info@restaurant.ae', dir: 'ltr' },
            { key: 'address', label: 'العنوان', placeholder: 'الإمارات، دبي...' },
            { key: 'capacity', label: 'السعة الاستيعابية (عدد المقاعد)', placeholder: '80', dir: 'ltr', type: 'number' },
          ].map(f => (
            <div key={f.key} className="space-y-1.5">
              <label className="block text-sm font-bold text-on-surface-variant">{f.label}</label>
              <input
                type={f.type ?? 'text'}
                dir={f.dir as any}
                value={(form as any)[f.key]}
                onChange={e => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="input-field py-3 ps-4"
              />
            </div>
          ))}
        </section>

        {/* Locale */}
        <section className="card p-6 space-y-5">
          <h3 className="title-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">language</span>
            اللغة والمنطقة
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-on-surface-variant">العملة</label>
              <select value={form.currency} onChange={e => set('currency', e.target.value)} className="input-field py-3 ps-4">
                <option value="AED">درهم إماراتي (AED)</option>
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="KWD">دينار كويتي (KWD)</option>
                <option value="USD">دولار أمريكي (USD)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-on-surface-variant">المنطقة الزمنية</label>
              <select value={form.timezone} onChange={e => set('timezone', e.target.value)} className="input-field py-3 ps-4">
                <option value="Asia/Dubai">توقيت الإمارات (GMT+4)</option>
                <option value="Asia/Riyadh">توقيت الرياض (GMT+3)</option>
                <option value="Asia/Kuwait">توقيت الكويت (GMT+3)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-on-surface-variant">لغة الواجهة</label>
              <select value={form.lang} onChange={e => set('lang', e.target.value)} className="input-field py-3 ps-4">
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end gap-3">
          <Link href="/settings" className="btn-ghost px-6 py-3 rounded-full">إلغاء</Link>
          <button type="submit" className="btn-primary px-8 py-3 rounded-full">
            {saved
              ? <><span className="material-symbols-outlined text-base">check</span> تم الحفظ</>
              : <><span className="material-symbols-outlined text-base">save</span> حفظ التغييرات</>
            }
          </button>
        </div>
      </form>
    </div>
  );
}
