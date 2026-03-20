import { listOrders, getOrdersSummary, getTopItems } from '@/lib/orders-store';
import Link from 'next/link';
import { OrdersList } from '@/components/orders/orders-list';

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  open:       { label: 'مفتوح',    color: 'bg-primary-container text-on-primary-container', dot: 'bg-primary animate-pulse' },
  served:     { label: 'تم التقديم', color: 'bg-blue-100 text-blue-700',                    dot: 'bg-blue-500' },
  paid:       { label: 'مدفوع',    color: 'bg-green-100 text-green-700',                    dot: 'bg-green-500' },
  cancelled:  { label: 'ملغي',     color: 'bg-error-container text-error',                  dot: 'bg-error' },
  refunded:   { label: 'مُسترد',   color: 'bg-zinc-100 text-zinc-500',                      dot: 'bg-zinc-400' },
};

const PAY_ICON: Record<string, string> = {
  cash: 'payments', card: 'credit_card', 'apple-pay': 'phone_iphone', split: 'call_split',
};

const fmt = (n: number) => new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(n);

export default function OrdersPage() {
  const orders = listOrders();
  const summary = getOrdersSummary();
  const topItems = getTopItems();

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="display-md">الطلبات</h2>
          <p className="body-md text-on-surface-variant">تاريخ الطلبات وتحليلات الإنفاق والأطباق الأكثر طلباً</p>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'طلبات مفتوحة',    value: summary.openOrders,    icon: 'receipt',        color: 'text-primary bg-primary-container/40' },
          { label: 'طلبات اليوم',     value: summary.todayOrders,   icon: 'today',          color: 'text-blue-700 bg-blue-50' },
          { label: 'إيراد اليوم',     value: fmt(summary.todayRevenue), icon: 'payments',   color: 'text-green-700 bg-green-100' },
          { label: 'متوسط قيمة الطلب', value: fmt(summary.avgOrderValue), icon: 'equalizer', color: 'text-amber-700 bg-amber-100' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders list — interactive client component */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="headline-sm">سجل الطلبات</h3>
          <OrdersList initialOrders={orders} />
        </div>

        {/* Right panel: Top items + revenue */}
        <div className="space-y-6">
          <div className="card surface-container-lowest p-6 space-y-5">
            <h3 className="title-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">emoji_food_beverage</span>
              الأطباق الأكثر طلباً
            </h3>
            <div className="space-y-4">
              {topItems.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-xl flex-shrink-0">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.nameAr}</p>
                    <div className="h-1.5 bg-surface-container rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.round((item.count / topItems[0].count) * 100)}%`, background: `linear-gradient(90deg,#944A00,#E67E22)`, opacity: 1 - idx * 0.15 }}
                      />
                    </div>
                  </div>
                  <div className="text-left flex-shrink-0">
                    <p className="font-black text-sm">{item.count}x</p>
                    <p className="text-[10px] text-on-surface-variant">{fmt(item.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 space-y-4" style={{ background: 'linear-gradient(135deg,rgba(148,74,0,0.08),rgba(230,126,34,0.05))' }}>
            <h3 className="title-lg">الإيراد الإجمالي</h3>
            <p className="display-md text-primary">{fmt(summary.totalRevenue)}</p>
            <p className="text-sm text-on-surface-variant">من {orders.filter(o => o.status === 'paid').length} طلب مدفوع</p>
          </div>
        </div>
      </div>
    </div>
  );
}
