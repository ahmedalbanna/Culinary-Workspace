'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import type { CustomerSegment, OfferChannel } from '@/lib/types';
import { SEGMENTS } from '@/lib/marketing-store';

const CHANNELS: { value: OfferChannel; label: string; icon: string; desc: string }[] = [
  { value: 'whatsapp',    label: 'واتساب',       icon: 'chat',          desc: 'أعلى معدل فتح (85%+)' },
  { value: 'sms',         label: 'SMS',          icon: 'sms',           desc: 'وصول فوري بدون إنترنت' },
  { value: 'email',       label: 'بريد إلكتروني', icon: 'mail',          desc: 'مناسب للعروض التفصيلية' },
  { value: 'server-note', label: 'ملاحظة للنادل', icon: 'sticky_note_2', desc: 'تنبيه فوري أثناء الخدمة' },
];

function NewOfferForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultSegment = (searchParams.get('segment') as CustomerSegment) || 'all';

  const [segment, setSegment] = useState<CustomerSegment>(defaultSegment);
  const [channel, setChannel] = useState<OfferChannel>('whatsapp');
  const [discount, setDiscount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiresAt, setExpiresAt] = useState('2026-04-30');
  const [tags, setTags] = useState('');

  const selectedSeg = SEGMENTS.find(s => s.value === segment)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/marketing/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, description, discount, channel, status: 'draft',
          segment, expiresAt, targetCount: selectedSeg.count,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      router.push('/marketing/offers' as any);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <header className="flex items-center gap-4">
        <Link href="/marketing" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors">
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        <div>
          <h2 className="headline-sm">عرض جديد</h2>
          <p className="body-md text-on-surface-variant">اصنع عرضاً مخصصاً وابعثه للشريحة المناسبة</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Segment */}
        <div className="card surface-container-lowest p-8 space-y-5">
          <h3 className="title-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">group</span>
            الشريحة المستهدفة
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SEGMENTS.map(seg => (
              <button
                key={seg.value}
                type="button"
                onClick={() => setSegment(seg.value)}
                className={`flex items-center gap-4 p-4 rounded-2xl text-right transition-all ${segment === seg.value ? 'ring-2 ring-primary bg-primary-container/20' : 'bg-surface-container-low hover:bg-surface-container-high'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${seg.color}`}>
                  <span className="material-symbols-outlined">{seg.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-bold">{seg.label}</p>
                    <p className="font-black text-primary">{seg.count.toLocaleString('ar')}</p>
                  </div>
                  <p className="text-[10px] text-on-surface-variant leading-tight truncate">{seg.description}</p>
                </div>
                {segment === seg.value && <span className="material-symbols-outlined text-primary flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 p-4 bg-primary-container/20 rounded-2xl">
            <span className="material-symbols-outlined text-primary">info</span>
            <p className="text-sm">سيُرسَل هذا العرض إلى <strong className="text-primary">{selectedSeg.count.toLocaleString('ar')} عميل</strong> من شريحة «{selectedSeg.label}»</p>
          </div>
        </div>

        {/* Offer details */}
        <div className="card surface-container-lowest p-8 space-y-5">
          <h3 className="title-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">local_offer</span>
            تفاصيل العرض
          </h3>
          <div className="space-y-2">
            <label className="label-md font-bold">عنوان العرض</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="مثال: خصم رمضان الخاص لعملاء VIP" className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <label className="label-md font-bold">وصف العرض</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="اشرح تفاصيل العرض والشروط..." className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="label-md font-bold">نسبة الخصم (%)</label>
              <div className="relative">
                <input type="number" min={0} max={100} value={discount} onChange={e => setDiscount(Number(e.target.value))} className="w-full bg-surface-container-high border-none rounded-2xl p-4 pl-10 outline-none focus:ring-2 focus:ring-primary" />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-primary">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="label-md font-bold">تاريخ الانتهاء</label>
              <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="label-md font-bold">وسوم (مفصولة بفاصلة)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="رمضان، VIP، إفطار" className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        {/* Channel */}
        <div className="card surface-container-lowest p-8 space-y-5">
          <h3 className="title-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">send</span>
            قناة الإرسال
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CHANNELS.map(ch => (
              <button
                key={ch.value}
                type="button"
                onClick={() => setChannel(ch.value)}
                className={`flex items-center gap-4 p-4 rounded-2xl text-right transition-all ${channel === ch.value ? 'ring-2 ring-primary bg-primary-container/20' : 'bg-surface-container-low hover:bg-surface-container-high'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${channel === ch.value ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined">{ch.icon}</span>
                </div>
                <div>
                  <p className="font-bold">{ch.label}</p>
                  <p className="text-[10px] text-on-surface-variant">{ch.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview strip */}
        <div className="card p-6 space-y-3" style={{ background: 'linear-gradient(135deg,rgba(148,74,0,0.08),rgba(230,126,34,0.05))' }}>
          <p className="label-md font-bold text-on-surface-variant uppercase">معاينة الرسالة</p>
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary font-black flex-shrink-0">م</div>
              <div className="flex-1">
                <p className="font-black text-sm">Maître D' Restaurant</p>
                <p className="text-sm text-on-surface-variant mt-1">
                  {title || 'عنوان العرض'}
                  {discount > 0 && <span className="text-primary font-bold"> — خصم {discount}%</span>}
                  {description && <span> · {description.slice(0, 60)}{description.length > 60 ? '...' : ''}</span>}
                </p>
                <p className="text-[10px] text-on-surface-variant mt-1">ينتهي {expiresAt}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={submitting || !title} className="btn-primary flex-1 justify-center py-4 text-lg disabled:opacity-60">
            <span className="material-symbols-outlined">save</span>
            {submitting ? 'جارٍ الحفظ...' : 'حفظ كمسودة'}
          </button>
          <button type="button" disabled={submitting || !title} className="flex-1 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-60" style={{ background: 'linear-gradient(135deg,#944A00,#E67E22)', color: 'white' }}>
            <span className="material-symbols-outlined">send</span>
            إرسال الآن
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewOfferPage() {
  return (
    <Suspense>
      <NewOfferForm />
    </Suspense>
  );
}
