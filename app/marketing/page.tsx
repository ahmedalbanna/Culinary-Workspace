import Link from 'next/link';
import { listCustomers } from '@/lib/store';

const campaigns = [
  { id: 'camp_1', title: 'عرض الويكند المميز', status: 'active', channel: 'sms', sent: 284, opened: 241, converted: 38, expiresAt: '2026-03-22', segment: 'VIP' },
  { id: 'camp_2', title: 'إفطار رمضان الخاص', status: 'active', channel: 'email', sent: 512, opened: 389, converted: 72, expiresAt: '2026-04-01', segment: 'وفاء' },
  { id: 'camp_3', title: 'حزمة الفطور الصباحي', status: 'completed', channel: 'email', sent: 178, opened: 134, converted: 21, expiresAt: '2026-03-10', segment: 'الكل' },
];

const channelIcon: Record<string, string> = { sms: 'sms', email: 'mail', 'server note': 'sticky_note_2' };
const channelLabel: Record<string, string> = { sms: 'رسالة نصية', email: 'بريد إلكتروني', 'server note': 'ملاحظة الخادم' };

export default function MarketingPage() {
  const customers = listCustomers();
  const offersReady = customers.flatMap(c => c.offers.map(o => ({ ...o, customer: c })));

  return (
    <div className="max-w-screen-xl mx-auto space-y-8">

      {/* Header */}
      <header className="page-header">
        <div>
          <h2 className="page-title">التسويق والعروض</h2>
          <p className="page-subtitle">حملات مخصصة وعروض ذكية مبنية على سلوك الضيوف</p>
        </div>
        <Link href={'/marketing/offers/new' as any} className="btn-primary">
          <span className="material-symbols-outlined">add</span>
          عرض جديد
        </Link>
      </header>

      {/* KPI strip */}
      <div className="metrics-grid">
        {[
          { label: 'حملات نشطة', value: campaigns.filter(c => c.status === 'active').length, icon: 'campaign', color: 'text-primary' },
          { label: 'إجمالي الرسائل', value: campaigns.reduce((s, c) => s + c.sent, 0).toLocaleString('ar'), icon: 'send', color: 'text-secondary' },
          { label: 'معدل الفتح', value: '76%', icon: 'mark_email_read', color: 'text-green-700' },
          { label: 'عملاء مستعدون', value: offersReady.length, icon: 'person_celebrate', color: 'text-yellow-700' },
        ].map(m => (
          <div key={m.label} className="metric-card">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{m.label}</span>
              <span className={`material-symbols-outlined text-xl ${m.color}`}>{m.icon}</span>
            </div>
            <p className="text-3xl font-extrabold text-on-surface tracking-tight">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Campaigns list — 2/3 */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-extrabold">الحملات الأخيرة</h3>
            <div className="flex gap-2">
              {['الكل', 'نشطة', 'مكتملة'].map((t, i) => (
                <button key={t} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${i === 0 ? 'bg-primary text-white' : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'}`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {campaigns.map(camp => {
              const openRate = Math.round((camp.opened / camp.sent) * 100);
              const convRate = Math.round((camp.converted / camp.sent) * 100);
              return (
                <div key={camp.id} className="card p-6 space-y-5">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${camp.status === 'active' ? 'bg-primary-container' : 'bg-surface-container-high'}`}>
                        <span className={`material-symbols-outlined ${camp.status === 'active' ? 'text-primary' : 'text-on-surface-variant'}`}>{channelIcon[camp.channel]}</span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-on-surface">{camp.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-on-surface-variant">{channelLabel[camp.channel]}</span>
                          <span className="w-1 h-1 rounded-full bg-outline-variant" />
                          <span className="text-xs text-on-surface-variant">الشريحة: {camp.segment}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${camp.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-surface-container text-on-surface-variant'}`}>
                        {camp.status === 'active' ? 'نشطة' : 'مكتملة'}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'أُرسلت', value: camp.sent.toLocaleString('ar') },
                      { label: 'نسبة الفتح', value: `${openRate}%`, highlight: openRate > 70 },
                      { label: 'تحويل', value: `${convRate}%`, highlight: convRate > 10 },
                    ].map(s => (
                      <div key={s.label} className="bg-surface-container-low rounded-xl p-3 text-center">
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">{s.label}</p>
                        <p className={`text-lg font-extrabold ${s.highlight ? 'text-green-700' : 'text-on-surface'}`}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-on-surface-variant">معدل التحويل</span>
                      <span className="font-bold">{convRate}%</span>
                    </div>
                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${convRate}%`, background: 'linear-gradient(90deg, #944A00, #E67E22)' }} />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1 border-t border-outline-variant/30">
                    <button className="btn-primary text-sm py-2.5 flex-1 justify-center">
                      <span className="material-symbols-outlined text-base">send</span>
                      إرسال مجدد
                    </button>
                    <button className="btn-secondary text-sm py-2.5 px-4">تفاصيل</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Create new offer CTA */}
          <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #944A00, #E67E22)' }}>
            <div className="relative z-10 space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-white/60">عرض مخصص</p>
              <h3 className="text-xl font-extrabold text-white leading-tight">أنشئ حملة جديدة مخصصة لضيوفك</h3>
              <p className="text-white/80 text-sm">بناءً على سلوك الزيارات والإنفاق</p>
              <Link href={'/marketing/offers/new' as any} className="inline-flex items-center gap-2 bg-white text-primary font-bold text-sm px-5 py-2.5 rounded-full hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-base">add</span>
                ابدأ الآن
              </Link>
            </div>
            <span className="material-symbols-outlined absolute -end-4 -bottom-4 text-white/10 select-none" style={{ fontSize: '8rem', fontVariationSettings: "'FILL' 1" }}>campaign</span>
          </div>

          {/* Ready offers */}
          <div className="card p-6 space-y-4">
            <h3 className="text-base font-extrabold">عروض جاهزة للإرسال</h3>
            <div className="space-y-3">
              {offersReady.map(({ customer, ...offer }) => (
                <div key={offer.id} className="flex items-start gap-3 p-3 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-colors">
                  <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-primary font-black flex-shrink-0">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-on-surface truncate">{offer.title}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">{customer.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="material-symbols-outlined text-xs text-primary">{channelIcon[offer.channel]}</span>
                      <span className="text-[10px] text-on-surface-variant">{channelLabel[offer.channel]}</span>
                    </div>
                  </div>
                  <button className="flex-shrink-0 text-primary hover:bg-primary-container p-1.5 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-base">send</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Channel breakdown */}
          <div className="card p-6 space-y-4">
            <h3 className="text-base font-extrabold">توزيع القنوات</h3>
            {[
              { label: 'بريد إلكتروني', pct: 58, icon: 'mail' },
              { label: 'رسالة نصية', pct: 32, icon: 'sms' },
              { label: 'ملاحظة خادم', pct: 10, icon: 'sticky_note_2' },
            ].map(ch => (
              <div key={ch.label}>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-sm text-primary">{ch.icon}</span>
                    {ch.label}
                  </span>
                  <span className="font-bold">{ch.pct}%</span>
                </div>
                <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${ch.pct}%`, background: 'linear-gradient(90deg, #944A00, #E67E22)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
