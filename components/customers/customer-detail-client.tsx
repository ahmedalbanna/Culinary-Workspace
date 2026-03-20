'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Customer, Reservation, Order, MarketingOffer } from '@/lib/types';

const fmt = (n: number) =>
  new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(n);

const STATUS_LABEL: Record<string, string> = { confirmed: 'مؤكد', seated: 'جالس', completed: 'مكتمل', waitlist: 'انتظار' };
const STATUS_COLOR: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700', seated: 'bg-primary-container text-on-primary-container',
  completed: 'bg-zinc-100 text-zinc-500',  waitlist: 'bg-amber-100 text-amber-700',
};
const TIER_CONFIG = {
  VIP:   { label: '⭐ VIP',  color: 'bg-primary-container text-primary',     points: 5000, max: 10000 },
  Loyal: { label: 'وفاء',   color: 'bg-green-100 text-green-700',            points: 2500, max: 5000  },
  New:   { label: 'جديد',   color: 'bg-zinc-100 text-zinc-600',              points: 500,  max: 2500  },
} as const;

const CHANNEL_ICON: Record<string, string> = { sms: 'sms', email: 'mail', whatsapp: 'chat', 'server-note': 'sticky_note_2' };
const CHANNEL_LABEL: Record<string, string> = { sms: 'SMS', email: 'بريد', whatsapp: 'واتساب', 'server-note': 'ملاحظة' };

interface Props {
  customer: Customer;
  reservations: Reservation[];
  orders: Order[];
  activeOffers: MarketingOffer[];
}

export function CustomerDetailClient({ customer: initial, reservations, orders, activeOffers }: Props) {
  const router                        = useRouter();
  const [customer, setCustomer]       = useState<Customer>(initial);
  const [editOpen, setEditOpen]       = useState(false);
  const [offerOpen, setOfferOpen]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [savedMsg, setSavedMsg]       = useState('');
  const [offerSent, setOfferSent]     = useState<string | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name:  customer.name,
    phone: customer.phone,
    email: customer.email,
    tier:  customer.tier as 'VIP' | 'Loyal' | 'New',
    notes: customer.notes ?? '',
  });

  // ── Computed ──────────────────────────────────────────────────────────────

  const paidOrders     = orders.filter(o => o.status === 'paid');
  const totalSpend     = paidOrders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue  = paidOrders.length ? Math.round(totalSpend / paidOrders.length) : 0;
  const lifetimeSpend  = totalSpend || customer.lifetimeSpend;

  // Loyalty points: 1 point per AED spent
  const loyaltyPoints  = Math.round(lifetimeSpend);
  const tierConf       = TIER_CONFIG[customer.tier as keyof typeof TIER_CONFIG] ?? TIER_CONFIG.New;
  const pointsPct      = Math.min((loyaltyPoints / tierConf.max) * 100, 100);
  const nextTierPoints = Math.max(tierConf.max - loyaltyPoints, 0);

  const topItems: { nameAr: string; emoji: string; count: number }[] = [];
  const itemCounts: Record<string, { nameAr: string; emoji: string; count: number }> = {};
  orders.forEach(o => o.items.forEach(i => {
    if (!itemCounts[i.name]) itemCounts[i.name] = { nameAr: i.nameAr, emoji: i.emoji, count: 0 };
    itemCounts[i.name].count += i.quantity;
  }));
  topItems.push(...Object.values(itemCounts).sort((a, b) => b.count - a.count).slice(0, 5));

  // Matching offers for this customer's tier
  const tierMap: Record<string, string[]> = { VIP: ['vip', 'all'], Loyal: ['loyal', 'all'], New: ['new', 'all'] };
  const matchingOffers = activeOffers.filter(o =>
    o.status === 'active' && tierMap[customer.tier]?.includes(o.segment)
  );

  // ── Actions ──────────────────────────────────────────────────────────────

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/customers/${customer.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    const data = await res.json();
    if (data.customer) {
      setCustomer(data.customer);
      setEditForm({
        name: data.customer.name, phone: data.customer.phone, email: data.customer.email,
        tier: data.customer.tier, notes: data.customer.notes ?? '',
      });
      setSavedMsg('تم حفظ التغييرات');
      setTimeout(() => setSavedMsg(''), 3000);
      setEditOpen(false);
    }
    setSaving(false);
  }

  function handleSendOffer(offer: MarketingOffer) {
    setOfferSent(offer.id);
    setTimeout(() => { setOfferSent(null); setOfferOpen(false); }, 2500);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">

      {/* Header */}
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/customers" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <div>
            <h2 className="headline-sm">ملف العميل</h2>
            <p className="body-md text-on-surface-variant">{customer.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {savedMsg && (
            <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1 animate-in fade-in">
              <span className="material-symbols-outlined text-sm">check_circle</span>{savedMsg}
            </span>
          )}
          <span className={`px-4 py-2 rounded-full text-sm font-black ${tierConf.color}`}>{tierConf.label}</span>
          <button
            onClick={() => setEditOpen(e => !e)}
            className="btn-secondary text-sm py-2 px-4"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            تعديل
          </button>
        </div>
      </header>

      {/* Hero profile card */}
      <div
        className="card p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-8"
        style={{ background: 'linear-gradient(135deg,rgba(148,74,0,0.08),rgba(230,126,34,0.05))' }}
      >
        <div className="w-24 h-24 rounded-3xl bg-primary-container flex items-center justify-center text-primary text-4xl font-black flex-shrink-0">
          {customer.name.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-right space-y-3 min-w-0">
          <div>
            <h3 className="display-md">{customer.name}</h3>
            <p className="body-md text-on-surface-variant">{customer.phone}</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {customer.allergies.filter(a => a !== 'None').map(a => (
              <span key={a} className="flex items-center gap-1 px-3 py-1 rounded-full bg-error-container text-error text-xs font-bold">
                <span className="material-symbols-outlined text-xs">warning</span>{a}
              </span>
            ))}
            {(customer as any).favoriteTable && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold">
                <span className="material-symbols-outlined text-xs">table_bar</span>طاولة {(customer as any).favoriteTable} المفضلة
              </span>
            )}
          </div>
          {customer.notes && (
            <p className="text-xs text-on-surface-variant italic border-s-2 border-primary/30 ps-3">"{customer.notes}"</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 text-center flex-shrink-0">
          {[
            { label: 'إجمالي الإنفاق',  value: fmt(lifetimeSpend) },
            { label: 'زيارة',            value: reservations.length.toString() },
            { label: 'متوسط الطلب',      value: fmt(avgOrderValue) },
            { label: 'طلب مدفوع',        value: paidOrders.length.toString() },
          ].map(m => (
            <div key={m.label} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-2xl font-black text-primary">{m.value}</p>
              <p className="text-[10px] text-on-surface-variant uppercase">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Loyalty points card */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="title-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            برنامج الولاء
          </h3>
          <span className={`text-xs font-black px-3 py-1 rounded-full ${tierConf.color}`}>{tierConf.label}</span>
        </div>

        <div className="flex items-end gap-4">
          <div>
            <p className="text-4xl font-extrabold text-primary tabular-nums">{loyaltyPoints.toLocaleString('ar-AE')}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">نقطة مكتسبة</p>
          </div>
          {nextTierPoints > 0 && (
            <div className="flex-1 pb-1">
              <p className="text-xs text-on-surface-variant mb-1.5">
                {nextTierPoints.toLocaleString('ar-AE')} نقطة للمستوى التالي
              </p>
              <div className="h-3 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pointsPct}%`, background: 'linear-gradient(90deg,#944A00,#E67E22)' }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-on-surface-variant mt-1">
                <span>0</span>
                <span>{tierConf.max.toLocaleString('ar-AE')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tier milestones */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {(['New', 'Loyal', 'VIP'] as const).map(t => {
            const tc = TIER_CONFIG[t];
            const isActive = customer.tier === t;
            const isPast = (t === 'New' && (customer.tier === 'Loyal' || customer.tier === 'VIP')) ||
                           (t === 'Loyal' && customer.tier === 'VIP');
            return (
              <div key={t} className={`p-3 rounded-2xl text-center transition-all ${isActive ? 'ring-2 ring-primary bg-primary-fixed/20' : isPast ? 'bg-surface-container opacity-60' : 'bg-surface-container-low'}`}>
                <span className={`material-symbols-outlined text-2xl ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
                  style={{ fontVariationSettings: isPast ? "'FILL' 1" : "'FILL' 0" }}>
                  {t === 'VIP' ? 'star' : t === 'Loyal' ? 'loyalty' : 'person'}
                </span>
                <p className="text-[10px] font-black mt-1">{tc.label.replace('⭐ ', '')}</p>
                <p className="text-[9px] text-on-surface-variant">{tc.points.toLocaleString('ar-AE')} نقطة</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* Order history */}
          {orders.length > 0 && (
            <div className="card surface-container-lowest overflow-hidden">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                <h3 className="title-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">receipt_long</span>
                  تاريخ الطلبات
                </h3>
                <Link href={`/customers/${customer.id}/orders` as any} className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
                  عرض الكل <span className="material-symbols-outlined text-base">arrow_back</span>
                </Link>
              </div>
              <div className="divide-y divide-outline-variant/30">
                {orders.slice(0, 4).map(order => (
                  <Link key={order.id} href={`/orders/${order.id}` as any} className="flex items-center gap-4 p-5 hover:bg-surface-container-low transition-colors group block">
                    <div className="flex -space-x-1 space-x-reverse flex-shrink-0">
                      {order.items.slice(0, 3).map(item => (
                        <div key={item.id} className="w-8 h-8 rounded-full bg-surface-container border-2 border-white flex items-center justify-center text-sm">{item.emoji}</div>
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm">{order.date} · {order.time}</p>
                      <p className="text-xs text-on-surface-variant truncate">{order.items.map(i => `${i.nameAr} ×${i.quantity}`).join(' · ')}</p>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <p className="font-black text-primary">{fmt(order.total)}</p>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full block text-center ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-primary-container text-primary'}`}>
                        {order.status === 'paid' ? 'مدفوع' : 'مفتوح'}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_left</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Reservation history */}
          <div className="card surface-container-lowest p-6 space-y-4">
            <h3 className="title-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
              تاريخ الحجوزات
            </h3>
            <div className="space-y-3">
              {reservations.length > 0 ? reservations.map(res => (
                <Link key={res.id} href={`/reservations/${res.id}` as any} className="flex justify-between items-center p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-colors group block">
                  <div>
                    <p className="font-bold">{res.date}</p>
                    <p className="text-xs text-on-surface-variant">{res.time} · طاولة {res.tableLabel} · {res.partySize} أفراد{res.occasion ? ` · ${res.occasion}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${STATUS_COLOR[res.status]}`}>{STATUS_LABEL[res.status]}</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_left</span>
                  </div>
                </Link>
              )) : (
                <p className="text-on-surface-variant text-sm">لا توجد حجوزات سابقة</p>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">

          {/* Offer targeting */}
          <div className="card surface-container-lowest p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="title-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_offer</span>
                إرسال عرض
              </h3>
              <span className="text-[10px] font-bold text-on-surface-variant">{matchingOffers.length} عرض متاح</span>
            </div>

            {offerSent ? (
              <div className="p-4 rounded-2xl bg-green-100 text-green-700 text-sm font-bold flex items-center gap-2 animate-in fade-in">
                <span className="material-symbols-outlined">check_circle</span>
                تم إرسال العرض بنجاح!
              </div>
            ) : matchingOffers.length === 0 ? (
              <div className="text-sm text-on-surface-variant text-center py-4">
                <span className="material-symbols-outlined block text-3xl mb-2 text-on-surface-variant/30">campaign</span>
                لا توجد عروض مناسبة لهذا العميل حالياً
              </div>
            ) : (
              <div className="space-y-3">
                {matchingOffers.slice(0, 3).map(offer => (
                  <div key={offer.id} className="p-4 rounded-2xl space-y-2" style={{ background: 'linear-gradient(135deg,rgba(148,74,0,0.06),rgba(230,126,34,0.04))' }}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-sm leading-tight">{offer.title}</p>
                        {offer.discount > 0 && <p className="text-xs text-primary font-black">خصم {offer.discount}%</p>}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant flex items-center gap-1 flex-shrink-0">
                        <span className="material-symbols-outlined text-xs">{CHANNEL_ICON[offer.channel]}</span>
                        {CHANNEL_LABEL[offer.channel]}
                      </span>
                    </div>
                    <button
                      onClick={() => handleSendOffer(offer)}
                      className="w-full btn-primary text-xs py-2 rounded-xl justify-center"
                    >
                      <span className="material-symbols-outlined text-sm">send</span>
                      إرسال الآن
                    </button>
                  </div>
                ))}
                <Link href="/marketing/offers/new" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 justify-center pt-1">
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  إنشاء عرض مخصص
                </Link>
              </div>
            )}
          </div>

          {/* Top items */}
          {topItems.length > 0 && (
            <div className="card surface-container-lowest p-6 space-y-4">
              <h3 className="title-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">favorite</span>
                الأطباق المفضلة
              </h3>
              <div className="space-y-3">
                {topItems.map((item, idx) => (
                  <div key={item.nameAr} className="flex items-center gap-3">
                    <span className="text-xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{item.nameAr}</p>
                      <div className="h-1.5 bg-surface-container rounded-full mt-1 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.round((item.count / (topItems[0]?.count || 1)) * 100)}%`, background: 'linear-gradient(90deg,#944A00,#E67E22)', opacity: 1 - idx * 0.15 }} />
                      </div>
                    </div>
                    <span className="text-xs font-black text-primary">{item.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preferences */}
          {customer.preferences.length > 0 && (
            <div className="card surface-container-lowest p-6 space-y-3">
              <h3 className="title-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">tune</span>
                التفضيلات
              </h3>
              {customer.preferences.map(p => (
                <div key={p.label} className="p-3 bg-surface-container-low rounded-xl">
                  <p className="text-xs font-black text-primary uppercase">{p.label}</p>
                  <p className="text-sm mt-0.5">{p.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── INLINE EDIT PANEL ─────────────────────────────────────────── */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(25,28,29,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-surface-container-lowest rounded-3xl shadow-ambient w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit</span>
                تعديل بيانات العميل
              </h3>
              <button onClick={() => setEditOpen(false)} className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-on-surface-variant">الاسم الكامل</label>
                <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="input-field py-3 ps-4" />
              </div>
              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-on-surface-variant">رقم الجوال</label>
                <input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  className="input-field py-3 ps-4" dir="ltr" />
              </div>
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-on-surface-variant">البريد الإلكتروني</label>
                <input value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                  className="input-field py-3 ps-4" dir="ltr" type="email" />
              </div>
              {/* Tier */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface-variant">فئة العميل</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['VIP', 'Loyal', 'New'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setEditForm(f => ({ ...f, tier: t }))}
                      className={`py-2.5 rounded-2xl text-sm font-bold transition-all ${editForm.tier === t ? 'ring-2 ring-primary bg-primary-fixed/30 text-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}>
                      {TIER_CONFIG[t].label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Notes */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-on-surface-variant">ملاحظات</label>
                <textarea rows={3} value={editForm.notes} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                  className="input-field py-3 ps-4 resize-none" placeholder="تفضيلات، حساسية، ملاحظات خاصة..." />
              </div>
              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditOpen(false)} className="btn-ghost flex-1 py-3 rounded-full">إلغاء</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-3 rounded-full justify-center">
                  {saving ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <span className="material-symbols-outlined">save</span>}
                  {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
