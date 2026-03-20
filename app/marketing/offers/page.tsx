import { listOffers } from '@/lib/marketing-store';
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

const SEG_LABEL: Record<string, string> = {
  vip: 'VIP', loyal: 'وفاء', new: 'جدد', 'at-risk': 'في خطر', all: 'الكل',
};

export default function AllOffersPage() {
  const offers = listOffers();

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/marketing" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <div>
            <h2 className="headline-sm">جميع العروض</h2>
            <p className="body-md text-on-surface-variant">{offers.length} عرض إجمالاً</p>
          </div>
        </div>
        <Link href="/marketing/offers/new" className="btn-primary">
          <span className="material-symbols-outlined">add</span>
          عرض جديد
        </Link>
      </header>

      <div className="card surface-container-lowest overflow-hidden">
        <div className="p-4 border-b border-outline-variant flex gap-2 flex-wrap">
          {['الكل', 'نشط', 'مسودة', 'موقوف', 'منتهي'].map((f, i) => (
            <button key={f} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${i === 0 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="divide-y divide-outline-variant">
          {offers.map(offer => (
            <Link
              key={offer.id}
              href={`/marketing/offers/${offer.id}` as any}
              className="flex flex-wrap items-center gap-6 p-6 hover:bg-surface-container-low transition-colors group"
            >
              <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${offer.discount > 0 ? 'bg-primary-container text-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined">{offer.discount > 0 ? 'local_offer' : CHANNEL_ICON[offer.channel]}</span>
                </div>
                <div>
                  <h4 className="font-bold group-hover:text-primary transition-colors">{offer.title}</h4>
                  <p className="text-xs text-on-surface-variant">{SEG_LABEL[offer.segment]} · عبر {offer.channel} · ينتهي {offer.expiresAt}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 text-center min-w-[240px]">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase">مُرسَل</p>
                  <p className="font-bold">{offer.sentCount}</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase">فتح</p>
                  <p className="font-bold text-primary">{offer.openRate}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase">استرداد</p>
                  <p className="font-bold">{offer.redeemCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black ${STATUS_CONFIG[offer.status].color}`}>
                  {STATUS_CONFIG[offer.status].label}
                </span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_left</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
