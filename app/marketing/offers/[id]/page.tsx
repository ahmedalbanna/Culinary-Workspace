import { getOffer } from '@/lib/marketing-store';
import { listCustomers } from '@/lib/store';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active:  { label: 'نشط',    color: 'bg-green-100 text-green-700' },
  draft:   { label: 'مسودة',  color: 'bg-zinc-100 text-zinc-500' },
  paused:  { label: 'موقوف',  color: 'bg-amber-100 text-amber-700' },
  expired: { label: 'منتهي',  color: 'bg-error-container text-error' },
};

const CHANNEL_ICON: Record<string, string> = {
  sms: 'sms', email: 'mail', whatsapp: 'chat', 'server-note': 'sticky_note_2',
};

const SEG_LABEL: Record<string, string> = {
  vip: 'VIP', loyal: 'وفاء', new: 'جدد', 'at-risk': 'في خطر', all: 'الكل',
};

export default function OfferDetailPage({ params }: { params: { id: string } }) {
  const offer = getOffer(params.id);
  if (!offer) notFound();

  const customers = listCustomers();
  const eligibleCustomers = offer.segment === 'vip'
    ? customers.filter(c => c.tier === 'VIP')
    : offer.segment === 'loyal'
    ? customers.filter(c => c.tier === 'Loyal')
    : offer.segment === 'new'
    ? customers.filter(c => c.tier === 'New')
    : customers;

  const redeemRate = offer.sentCount > 0 ? Math.round((offer.redeemCount / offer.sentCount) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/marketing/offers" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <div>
            <h2 className="headline-sm line-clamp-1">{offer.title}</h2>
            <p className="body-md text-on-surface-variant">{SEG_LABEL[offer.segment]} · عبر {offer.channel}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-black ${STATUS_CONFIG[offer.status].color}`}>
            {STATUS_CONFIG[offer.status].label}
          </span>
          {offer.status === 'draft' && (
            <button className="btn-primary">
              <span className="material-symbols-outlined">send</span>
              إرسال الآن
            </button>
          )}
          {offer.status === 'active' && (
            <button className="btn-secondary">
              <span className="material-symbols-outlined">pause</span>
              إيقاف
            </button>
          )}
        </div>
      </header>

      {/* Hero offer card */}
      <div className="card p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#944A00,#E67E22)' }}>
        <div className="relative z-10 space-y-3">
          {offer.discount > 0 && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="material-symbols-outlined text-white text-sm">local_offer</span>
              <span className="text-white font-black text-lg">خصم {offer.discount}%</span>
            </div>
          )}
          <h3 className="text-2xl font-black text-white">{offer.title}</h3>
          <p className="text-white/80">{offer.description}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {offer.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">#{tag}</span>
            ))}
          </div>
        </div>
        <span className="absolute -left-6 -bottom-6 text-9xl text-white/10 material-symbols-outlined">local_offer</span>
      </div>

      {/* Performance metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المُرسَل', value: offer.sentCount, icon: 'send', color: 'text-blue-700 bg-blue-50' },
          { label: 'معدل الفتح',     value: `${offer.openRate}%`, icon: 'open_in_new', color: 'text-green-700 bg-green-100' },
          { label: 'تم الاسترداد',   value: offer.redeemCount, icon: 'redeem', color: 'text-primary bg-primary-container/40' },
          { label: 'معدل الاسترداد', value: `${redeemRate}%`, icon: 'percent', color: 'text-amber-700 bg-amber-100' },
        ].map(item => (
          <div key={item.label} className="card surface-container-lowest p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
              <span className="material-symbols-outlined text-sm">{item.icon}</span>
            </div>
            <p className="text-xs text-on-surface-variant">{item.label}</p>
            <p className="text-2xl font-black">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Funnel bars */}
      <div className="card surface-container-lowest p-6 space-y-5">
        <h3 className="title-lg">مسار الأداء</h3>
        {[
          { label: 'تم الإرسال',  value: offer.sentCount,   max: offer.targetCount, color: 'bg-blue-400' },
          { label: 'تم الفتح',    value: Math.round(offer.sentCount * offer.openRate / 100), max: offer.targetCount, color: 'bg-green-500' },
          { label: 'تم الاسترداد', value: offer.redeemCount, max: offer.targetCount, color: 'bg-primary' },
        ].map(row => {
          const pct = offer.targetCount > 0 ? Math.round((row.value / offer.targetCount) * 100) : 0;
          return (
            <div key={row.label} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{row.label}</span>
                <span className="font-bold">{row.value} <span className="text-on-surface-variant font-normal">({pct}%)</span></span>
              </div>
              <div className="h-3 bg-surface-container rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${row.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Details */}
      <div className="card surface-container-lowest p-6 space-y-4">
        <h3 className="title-lg">تفاصيل العرض</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-4 rounded-xl">
            <p className="text-xs text-on-surface-variant mb-1">قناة الإرسال</p>
            <p className="font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">{CHANNEL_ICON[offer.channel]}</span>
              {offer.channel}
            </p>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl">
            <p className="text-xs text-on-surface-variant mb-1">الشريحة المستهدفة</p>
            <p className="font-bold">{SEG_LABEL[offer.segment]}</p>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl">
            <p className="text-xs text-on-surface-variant mb-1">تاريخ الإنشاء</p>
            <p className="font-bold">{offer.createdAt}</p>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl">
            <p className="text-xs text-on-surface-variant mb-1">تاريخ الانتهاء</p>
            <p className="font-bold">{offer.expiresAt}</p>
          </div>
        </div>
      </div>

      {/* Eligible customers */}
      {eligibleCustomers.length > 0 && (
        <div className="card surface-container-lowest p-6 space-y-4">
          <h3 className="title-lg">العملاء المؤهلون ({eligibleCustomers.length})</h3>
          <div className="space-y-3">
            {eligibleCustomers.map(customer => (
              <Link key={customer.id} href={`/customers/${customer.id}` as any} className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-black">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{customer.name}</p>
                    <p className="text-xs text-on-surface-variant">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${customer.tier === 'VIP' ? 'bg-primary-container text-primary' : customer.tier === 'Loyal' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'}`}>
                    {customer.tier}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_left</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
