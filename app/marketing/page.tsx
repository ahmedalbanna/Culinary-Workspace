import { listOffers, getMarketingSummary, SEGMENTS } from '@/lib/marketing-store';
import Link from 'next/link';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active:  { label: 'نشط',    color: 'bg-green-100 text-green-700' },
  draft:   { label: 'مسودة',  color: 'bg-zinc-100 text-zinc-500' },
  paused:  { label: 'موقوف',  color: 'bg-amber-100 text-amber-700' },
  expired: { label: 'منتهي',  color: 'bg-error-container text-error' },
};

const CHANNEL_ICON: Record<string, string> = {
  sms: 'sms', email: 'mail', whatsapp: 'chat', 'server-note': 'sticky_note_2',
};

export default function MarketingPage() {
  const offers = listOffers();
  const summary = getMarketingSummary();
  const active = offers.filter(o => o.status === 'active');
  const others = offers.filter(o => o.status !== 'active');

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="display-md">استوديو التسويق</h2>
          <p className="body-md text-on-surface-variant">العروض الشخصية وتقسيم العملاء وحملات الولاء</p>
        </div>
        <div className="flex gap-3">
          <Link href="/marketing/offers" className="btn-secondary flex items-center gap-2">
            <span className="material-symbols-outlined">list</span>
            كل العروض
          </Link>
          <Link href="/marketing/offers/new" className="btn-primary">
            <span className="material-symbols-outlined">add</span>
            عرض جديد
          </Link>
        </div>
      </header>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'عروض نشطة',      value: summary.activeOffers,  icon: 'local_offer',  color: 'text-primary bg-primary-container/40' },
          { label: 'إجمالي مُرسَل',  value: summary.totalSent,     icon: 'send',         color: 'text-blue-700 bg-blue-50' },
          { label: 'معدل الفتح',     value: `${summary.avgOpenRate}%`, icon: 'open_in_new', color: 'text-green-700 bg-green-100' },
          { label: 'معدل الاسترداد', value: `${summary.redeemRate}%`,  icon: 'redeem',      color: 'text-amber-700 bg-amber-100' },
        ].map(item => (
          <div key={item.label} className="card surface-container-lowest p-5 flex gap-4 items-center">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color}`}>
              <span className="material-symbols-outlined">{item.icon}</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">{item.label}</p>
              <p className="headline-sm">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Segments */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="headline-sm">تقسيم العملاء</h3>
          <Link href="/marketing/offers/new" className="text-primary font-bold hover:underline text-sm flex items-center gap-1">
            استهدف شريحة <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {SEGMENTS.map(seg => (
            <Link
              key={seg.value}
              href={`/marketing/offers/new?segment=${seg.value}` as any}
              className="card surface-container-lowest p-5 flex flex-col gap-3 hover:translate-y-[-4px] transition-transform group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${seg.color}`}>
                <span className="material-symbols-outlined">{seg.icon}</span>
              </div>
              <div>
                <p className="font-black">{seg.label}</p>
                <p className="text-[10px] text-on-surface-variant leading-tight">{seg.description}</p>
              </div>
              <p className="text-2xl font-black text-primary">{seg.count.toLocaleString('ar')}</p>
              <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">
                <span className="material-symbols-outlined text-xs">send</span>
                استهدف الآن
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Active Offers */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="headline-sm">العروض النشطة</h3>
          <Link href="/marketing/offers" className="text-primary font-bold hover:underline text-sm flex items-center gap-1">
            عرض الكل <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {active.map(offer => (
            <Link
              key={offer.id}
              href={`/marketing/offers/${offer.id}` as any}
              className="card surface-container-lowest p-6 flex flex-col gap-5 hover:translate-y-[-4px] transition-transform group relative overflow-hidden"
            >
              {/* Warm glow badge */}
              {offer.discount > 0 && (
                <div className="absolute top-4 left-4 w-14 h-14 rounded-full flex flex-col items-center justify-center text-white font-black shadow-lg text-xs" style={{ background: 'linear-gradient(135deg,#944A00,#E67E22)' }}>
                  <span className="text-lg leading-none">{offer.discount}%</span>
                  <span className="text-[9px] opacity-80">خصم</span>
                </div>
              )}

              <div className="flex items-start justify-between pr-12">
                <div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${STATUS_CONFIG[offer.status].color}`}>
                    {STATUS_CONFIG[offer.status].label}
                  </span>
                  <h4 className="font-black text-lg mt-2 leading-snug">{offer.title}</h4>
                </div>
              </div>

              <p className="text-sm text-on-surface-variant line-clamp-2">{offer.description}</p>

              <div className="flex flex-wrap gap-2">
                {offer.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-surface-container text-[10px] font-medium text-on-surface-variant">#{tag}</span>
                ))}
              </div>

              {/* Performance metrics */}
              <div className="space-y-2 pt-3 border-t border-outline-variant">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">معدل الفتح</span>
                  <span className="font-bold text-primary">{offer.openRate}%</span>
                </div>
                <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${offer.openRate}%`, background: 'linear-gradient(90deg,#944A00,#E67E22)' }} />
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">{CHANNEL_ICON[offer.channel]}</span>{offer.sentCount} مُرسَل</span>
                  <span>{offer.redeemCount} مستردّ</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">event</span>ينتهي {offer.expiresAt}</span>
                <span className="text-primary font-bold group-hover:underline">التفاصيل ←</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Drafts & paused */}
      {others.length > 0 && (
        <section className="space-y-4">
          <h3 className="headline-sm text-on-surface-variant">مسودات وموقوفة</h3>
          <div className="card surface-container-lowest divide-y divide-outline-variant">
            {others.map(offer => (
              <Link key={offer.id} href={`/marketing/offers/${offer.id}` as any} className="flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined">{CHANNEL_ICON[offer.channel]}</span>
                  </div>
                  <div>
                    <p className="font-bold">{offer.title}</p>
                    <p className="text-xs text-on-surface-variant">{offer.segment} · ينتهي {offer.expiresAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${STATUS_CONFIG[offer.status].color}`}>
                    {STATUS_CONFIG[offer.status].label}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_left</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
