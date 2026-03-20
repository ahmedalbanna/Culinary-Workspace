import { getDashboardSnapshot, getTableSummary } from '@/lib/store';
import { getOrdersSummary, listOrders } from '@/lib/orders-store';
import Link from 'next/link';
import { DashboardKPIs } from '@/components/dashboard/dashboard-kpis';
import { ReservationTimeline } from '@/components/dashboard/reservation-timeline';
import { TableStatusRing } from '@/components/dashboard/table-status-ring';
import { RevenueSparkline } from '@/components/dashboard/revenue-sparkline';

export default function DashboardPage() {
  const snapshot     = getDashboardSnapshot();
  const tableSummary = getTableSummary();
  const orderSummary = getOrdersSummary();
  const orders       = listOrders();

  // 7-day revenue sparkline data (simulated for last 6 days + today)
  const dailyRevenue = [820, 1240, 960, 1580, 1100, 1420, orderSummary.todayRevenue];

  const paidOrders  = orders.filter(o => o.status === 'paid');

  return (
    <div className="space-y-8 max-w-screen-xl mx-auto">

      {/* ── Top bar ── */}
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface">مرحباً، أحمد 👋</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            ملخص أداء المطعم — {new Date('2026-03-20').toLocaleDateString('ar-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
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
            <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-error" />
          </button>
        </div>
      </header>

      {/* ── Hero CTA ── */}
      <div
        className="rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row justify-between gap-6"
        style={{ background: 'linear-gradient(135deg, #944A00 0%, #c05f00 50%, #E67E22 100%)' }}
      >
        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">Digital Maître D'</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">نظام إدارة المطعم</h3>
          <p className="text-white/80 text-sm max-w-md leading-relaxed">
            تتبع تفضيلات الضيوف، تاريخ الطلبات، والعروض المخصصة مع إدارة كاملة للحجوزات
          </p>
        </div>
        <div className="flex flex-row sm:flex-col items-center justify-center gap-3 relative z-10">
          <Link
            href={'/reservations/new' as any}
            className="btn-primary shadow-ambient whitespace-nowrap"
            style={{ background: '#fff', color: '#944A00' }}
          >
            <span className="material-symbols-outlined">add</span>
            حجز جديد
          </Link>
          <Link href={'/reservations' as any} className="btn-ghost text-white/90 border border-white/30 hover:bg-white/10 whitespace-nowrap">
            عرض الكل
          </Link>
        </div>
        <span
          className="material-symbols-outlined absolute -end-6 -bottom-6 text-white/5 select-none"
          style={{ fontSize: '10rem', fontVariationSettings: "'FILL' 1" }}
        >restaurant</span>
      </div>

      {/* ── Live KPIs + alert chips ── */}
      <DashboardKPIs
        initialReservations={snapshot.reservations}
        initialTodayCovers={snapshot.todaysCovers}
        initialProjectedRevenue={snapshot.projectedRevenue}
        initialVipArrivals={snapshot.vipArrivals}
        initialOpenOrders={orderSummary.openOrders}
        initialNeedsCleaning={tableSummary.needsCleaning}
      />

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Timeline — 2/3 width */}
        <div className="lg:col-span-2 space-y-0">
          <ReservationTimeline reservations={snapshot.reservations} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Table status donut */}
          <TableStatusRing initialSummary={tableSummary} />

          {/* Revenue sparkline */}
          <RevenueSparkline
            initialRevenue={orderSummary.totalRevenue}
            initialPaidCount={paidOrders.length}
            initialDailyData={dailyRevenue}
          />

          {/* Offers CTA */}
          <div className="card-low p-6 relative overflow-hidden">
            <span
              className="material-symbols-outlined absolute -end-4 -bottom-4 text-primary/5 select-none"
              style={{ fontSize: '7rem', fontVariationSettings: "'FILL' 1" }}
            >campaign</span>
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
