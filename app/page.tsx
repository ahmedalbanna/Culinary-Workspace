import { getDashboardSnapshot } from '@/lib/store';
import Link from 'next/link';

function formatAED(amount: number) {
  return new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(amount);
}

const statusLabels: Record<string, string> = {
  confirmed: 'مؤكد', seated: 'جالس', completed: 'مكتمل', waitlist: 'انتظار',
};

const zoneLabels: Record<string, string> = {
  'Patio': 'التراس', 'Window': 'النوافذ', 'Main Hall': 'القاعة', 'Chef Counter': 'الشيف',
};

export default function DashboardPage() {
  const snapshot = getDashboardSnapshot();

  const metrics = [
    { label: 'الحجوزات اليوم', value: snapshot.reservations.length, icon: 'event_available', color: 'text-primary', trend: '+12%' },
    { label: 'إجمالي الزوار', value: snapshot.todaysCovers, icon: 'groups', color: 'text-secondary', trend: null },
    { label: 'الإيراد المتوقع', value: formatAED(snapshot.projectedRevenue), icon: 'payments', color: 'text-green-700', trend: '+5%' },
    { label: 'ضيوف VIP اليوم', value: snapshot.vipArrivals, icon: 'star', color: 'text-yellow-700', trend: null },
  ];

  const zones = ['Patio', 'Window', 'Main Hall', 'Chef Counter'];
  const zoneTotals: Record<string, number> = { Patio: 10, Window: 8, 'Main Hall': 20, 'Chef Counter': 6 };

  return (
    <div className="space-y-8 max-w-screen-xl mx-auto">

      {/* ── Top bar ── */}
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface">مرحباً، أحمد 👋</h2>
          <p className="text-sm text-on-surface-variant mt-1">ملخص أداء المطعم — {new Date('2026-03-20').toLocaleDateString('ar-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
            <input
              type="text"
              placeholder="ابحث عن حجز أو عميل..."
              className="input-field ps-10 pe-4 py-2.5 text-sm w-56 lg:w-72"
            />
          </div>
          <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors relative">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-error"></span>
          </button>
        </div>
      </header>

      {/* ── Hero CTA card ── */}
      <div className="rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row justify-between gap-6"
        style={{ background: 'linear-gradient(135deg, #944A00 0%, #c05f00 50%, #E67E22 100%)' }}>
        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">Digital Maître D'</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">نظام إدارة المطعم</h3>
          <p className="text-white/80 text-sm max-w-md leading-relaxed">تتبع تفضيلات الضيوف، تاريخ الطلبات، والعروض المخصصة مع إدارة كاملة للحجوزات</p>
        </div>
        <div className="flex flex-row sm:flex-col items-center justify-center gap-3 relative z-10">
          <Link href={'/reservations/new' as any} className="btn-primary bg-white text-primary hover:bg-primary-container shadow-ambient whitespace-nowrap"
            style={{ background: '#fff', color: '#944A00' }}>
            <span className="material-symbols-outlined">add</span>
            حجز جديد
          </Link>
          <Link href={'/reservations' as any} className="btn-ghost text-white/90 border border-white/30 hover:bg-white/10 whitespace-nowrap">
            عرض الكل
          </Link>
        </div>
        {/* Decorative */}
        <span className="material-symbols-outlined absolute -end-6 -bottom-6 text-white/5 select-none"
          style={{ fontSize: '10rem', fontVariationSettings: "'FILL' 1" }}>restaurant</span>
      </div>

      {/* ── Metrics ── */}
      <div className="metrics-grid">
        {metrics.map((m) => (
          <div key={m.label} className="metric-card">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{m.label}</span>
              <span className={`material-symbols-outlined text-xl ${m.color}`}>{m.icon}</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-on-surface tracking-tight">{m.value}</p>
              {m.trend && (
                <p className="text-xs font-bold text-green-700 flex items-center gap-0.5 mt-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span> {m.trend} من الأمس
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent reservations — 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-extrabold text-on-surface">أحدث الحجوزات</h3>
            <Link href={'/reservations' as any} className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
              عرض الكل <span className="material-symbols-outlined text-base">arrow_back</span>
            </Link>
          </div>

          <div className="space-y-3">
            {snapshot.reservations.slice(0, 5).map((res) => {
              const customer = snapshot.customers.find(c => c.id === res.customerId);
              return (
                <Link
                  key={res.id}
                  href={`/reservations/${res.id}` as any}
                  className="card p-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors group block"
                >
                  <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center text-primary font-black text-lg flex-shrink-0">
                    {res.guestName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-on-surface truncate">{res.guestName}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {res.time} • طاولة {res.tableLabel} • {res.partySize} أفراد
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`status-chip status-${res.status}`}>{statusLabels[res.status]}</span>
                    {customer?.tier === 'VIP' && (
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-primary-container text-primary">VIP</span>
                    )}
                    <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors">arrow_back</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Zone heatmap */}
          <div className="card p-6">
            <h3 className="text-base font-extrabold mb-5">توزيع المناطق اليوم</h3>
            <div className="space-y-4">
              {zones.map((zone) => {
                const count = snapshot.reservations.filter(r => r.zone === zone).length;
                const total = zoneTotals[zone];
                const pct = Math.min(Math.round((count / total) * 100), 100);
                return (
                  <div key={zone}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-bold text-on-surface">{zoneLabels[zone]}</span>
                      <span className="text-on-surface-variant">{count}/{total}</span>
                    </div>
                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #944A00, #E67E22)' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick action: offer ready */}
          <div className="card-low p-6 relative overflow-hidden">
            <span className="material-symbols-outlined absolute -end-4 -bottom-4 text-primary/5 select-none"
              style={{ fontSize: '7rem', fontVariationSettings: "'FILL' 1" }}>campaign</span>
            <div className="relative z-10">
              <span className="text-xs font-black uppercase tracking-widest text-primary">عروض مخصصة</span>
              <p className="text-2xl font-extrabold text-on-surface mt-1">{snapshot.offerReadyCount}</p>
              <p className="text-xs text-on-surface-variant mb-4">عميل جاهز لتلقي عرض مخصص</p>
              <Link href={'/marketing' as any} className="btn-primary text-sm py-2.5">
                <span className="material-symbols-outlined text-base">campaign</span>
                عرض التسويق
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
