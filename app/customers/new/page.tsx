'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Tier = 'VIP' | 'Loyal' | 'New';

const TIER_OPTIONS: { value: Tier; label: string; sub: string }[] = [
  { value: 'VIP',   label: 'VIP',    sub: 'خدمة مميزة وأولوية حجز' },
  { value: 'Loyal', label: 'عضو وفاء', sub: 'عميل مسجل في برنامج الولاء' },
  { value: 'New',   label: 'عادي',   sub: 'عميل جديد أو غير مسجل' },
];

export default function NewCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const [form, setForm] = useState({
    name: '', phone: '', email: '', birthday: '', notes: '', tier: 'New' as Tier,
  });
  const [phoneError, setPhoneError] = useState('');

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'phone') setPhoneError('');
  }

  function validatePhone(raw: string): string {
    const digits = raw.replace(/\D/g, '');
    // Accept: 5XXXXXXXX (9 digits) or 05XXXXXXXX (10 digits) or +9665XXXXXXXX
    const stripped = digits.replace(/^(966|0)/, '');
    if (!stripped) return 'رقم الجوال مطلوب';
    if (!/^5[0-9]{8}$/.test(stripped)) return 'يجب أن يبدأ الرقم بـ 5 ويتكوّن من 9 أرقام (مثال: 512345678)';
    return '';
  }

  function handlePhoneBlur() {
    const err = validatePhone(form.phone);
    setPhoneError(err);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pErr = validatePhone(form.phone);
    if (pErr) { setPhoneError(pErr); return; }
    if (!form.name.trim()) {
      setError('الاسم الكامل مطلوب');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('فشل الحفظ');
      const customer = await res.json();
      router.push(`/customers/${customer.id}` as any);
    } catch {
      setError('حدث خطأ، يرجى المحاولة مجدداً');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <Link
          href="/customers"
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors"
        >
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        <div>
          <h2 className="page-title">إضافة عميل جديد</h2>
          <p className="page-subtitle">أدخل بيانات الضيف لإضافته لقاعدة بيانات المطعم</p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main form — 2 cols */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic info */}
            <section className="card p-8 space-y-6">
              <h3 className="title-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                المعلومات الأساسية
              </h3>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-on-surface-variant">الاسم الكامل *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="مثال: أحمد محمد علي"
                    className="input-field py-3.5 ps-4"
                  />
                  <div className="absolute bottom-0 start-0 end-0 h-0.5 bg-primary scale-x-0 focus-within:scale-x-100 transition-transform rounded-b-lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-on-surface-variant">رقم الجوال *</label>
                  <div className={`flex items-center input-field p-0 overflow-hidden transition-colors ${phoneError ? 'ring-2 ring-error bg-error-container/10' : ''}`}>
                    <span className={`px-4 text-sm border-e py-3.5 flex-shrink-0 ${phoneError ? 'text-error border-error/40' : 'text-on-surface-variant border-outline-variant'}`}>+966</span>
                    <input
                      type="tel"
                      dir="ltr"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      onBlur={handlePhoneBlur}
                      placeholder="5XXXXXXXX"
                      maxLength={12}
                      inputMode="numeric"
                      className="flex-1 bg-transparent border-none py-3.5 px-3 focus:ring-0 text-sm"
                    />
                    {form.phone && !phoneError && /^5[0-9]{8}$/.test(form.phone.replace(/\D/g, '').replace(/^(966|0)/, '')) && (
                      <span className="material-symbols-outlined text-green-600 pe-3" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                  </div>
                  {phoneError && (
                    <p className="text-xs text-error flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {phoneError}
                    </p>
                  )}
                  {!phoneError && form.phone && (
                    <p className="text-[10px] text-on-surface-variant/60">سيتم حفظه بصيغة: +966{form.phone.replace(/\D/g, '').replace(/^(966|0)/, '')}</p>
                  )}
                </div>

                {/* Birthday */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-on-surface-variant">تاريخ الميلاد</label>
                  <input
                    type="date"
                    value={form.birthday}
                    onChange={e => set('birthday', e.target.value)}
                    className="input-field py-3.5 ps-4"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-on-surface-variant">البريد الإلكتروني (اختياري)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="example@domain.com"
                  dir="ltr"
                  className="input-field py-3.5 ps-4"
                />
              </div>
            </section>

            {/* Notes */}
            <section className="card p-8 space-y-4">
              <h3 className="title-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">notes</span>
                ملاحظات وتفضيلات خاصة
              </h3>
              <p className="text-sm text-on-surface-variant">
                أضف أي تفاصيل مهمة مثل الحساسية الغذائية أو الطاولة المفضلة.
              </p>
              <textarea
                rows={4}
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="مثال: يفضل الطاولات المطلة على النافذة، لديه حساسية من المكسرات..."
                className="input-field py-3.5 ps-4 resize-none"
              />
            </section>

          </div>

          {/* Sidebar — tier + actions */}
          <aside className="space-y-6">
            <div className="card p-6 sticky top-24 space-y-6">
              <h3 className="title-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">military_tech</span>
                فئة العميل
              </h3>

              <div className="space-y-3">
                {TIER_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                      form.tier === opt.value
                        ? 'border-primary bg-primary-fixed/30'
                        : 'border-transparent hover:bg-surface-container-high'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tier"
                      value={opt.value}
                      checked={form.tier === opt.value}
                      onChange={() => set('tier', opt.value)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-on-surface">{opt.label}</p>
                      <p className="text-xs text-on-surface-variant">{opt.sub}</p>
                    </div>
                    {form.tier === opt.value && (
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                  </label>
                ))}
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-error-container text-error text-sm font-bold">
                  {error}
                </div>
              )}

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-4 rounded-full text-base"
                >
                  {loading
                    ? <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    : <span className="material-symbols-outlined">person_add</span>
                  }
                  {loading ? 'جاري الحفظ...' : 'حفظ بيانات العميل'}
                </button>
                <Link
                  href="/customers"
                  className="btn-ghost w-full justify-center py-4 rounded-full text-base"
                >
                  إلغاء
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </form>
    </div>
  );
}
