import { listCustomers } from '@/lib/store';
import Link from 'next/link';

const statusLabels: Record<string, string> = { pending: 'معلق', preparing: 'قيد التحضير', served: 'قُدِّم', paid: 'مدفوع' };
const statusChip: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-primary-container text-primary',
  served: 'bg-green-100 text-green-800',
  paid: 'bg-surface-container text-on-surface-variant',
};

// Derive orders from customer history for realistic seed data
function buildOrders(customers: ReturnType<typeof listCustomers>) {
  const statuses = ['paid', 'served', 'preparing', 'pending'] as const;
  return customers.flatMap((customer, ci) =>
    customer.orderHistory.map((order, oi) => ({
      id: order.id,
      customerId: customer.id,
      customerName: customer.name,
      customerTier: customer.tier,
      date: order.date,
      total: order.total,
      items: order.items,
      status: statuses[(ci + oi) % statuses.length],
      tableLabel: ['M2', 'P1', 'W4', 'C1', 'M6'][(ci + oi) % 5],
    }))
  );
}

export default function OrdersPage() {
  const customers = listCustomers();
  const orders = buildOrders(customers);

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrder = Math.round(totalRevenue / (orders.length || 1));

  return (
    <div className="max-w-screen-xl mx-auto space-y-8">

      {/* Header */}
      <header className="page-header">
        <div>
          <h2 className="page-title">الطلبات</h2>
          <p className="page-subtitle">تتبع الطلبات النشطة وتاريخ المبيعات المرتبط بالعملاء</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <span className="material-symbols-outlined text-base">download</span>
            تصدير
          </button>
        </div>
      </header>

      {/* KPI strip */}
      <div className="metrics-grid">
        {[
          { label: 'إجمالي الطلبات', value: orders.length, icon: 'receipt_long', color: 'text-primary' },
          { label: 'إجمالي الإيرادات', value: `${totalRevenue.toLocaleString('ar')} د.إ`, icon: 'payments', color: 'text-green-700' },
          { label: 'متوسط الطلب', value: `${avgOrder.toLocaleString('ar')} د.إ`, icon: 'bar_chart', color: 'text-secondary' },
          { label: 'قيد التحضير', value: orders.filter(o => o.status === 'preparing').length, icon: 'skillet', color: 'text-yellow-700' },
        ].map(m => (
          <div key={m.label} className="metric-card">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{m.label}</span>
              <span className={`material-symbols-outlined text-xl ${m.color}`}>{m.icon}</span>
            </div>
            <p className="text-2xl font-extrabold text-on-surface tracking-tight">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="card-low p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input type="text" placeholder="ابحث بالاسم أو رقم الطاولة..." className="input-field ps-10 py-2.5 text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['الكل', 'معلق', 'قيد التحضير', 'قُدِّم', 'مدفوع'].map((s, i) => (
            <button key={s} className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${i === 0 ? 'bg-primary text-white' : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Orders list — card on mobile, table on desktop */}
      <div className="sm:hidden space-y-3">
        {orders.map(order => (
          <div key={order.id} className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-black flex-shrink-0">
                  {order.customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{order.customerName}</p>
                  <p className="text-xs text-on-surface-variant">طاولة {order.tableLabel} • {order.date}</p>
                </div>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${statusChip[order.status]}`}>{statusLabels[order.status]}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {order.items.map(item => (
                <span key={item.name} className="px-2.5 py-1 bg-surface-container rounded-full text-xs font-medium">{item.quantity}× {item.name}</span>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-outline-variant/30">
              <span className="text-xs text-on-surface-variant">رقم الطلب: {order.id}</span>
              <span className="font-extrabold text-primary">{order.total.toLocaleString('ar')} د.إ</span>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden sm:block card overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-surface-container-low">
              {['العميل', 'الطاولة', 'الأصناف', 'التاريخ', 'الإجمالي', 'الحالة', ''].map(h => (
                <th key={h} className="px-5 py-4 text-xs text-on-surface-variant font-black uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-primary font-black flex-shrink-0">
                      {order.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{order.customerName}</p>
                      {order.customerTier === 'VIP' && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-primary-container text-primary uppercase">VIP</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="font-bold text-sm bg-surface-container px-3 py-1 rounded-full">{order.tableLabel}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {order.items.slice(0, 2).map(item => (
                      <span key={item.name} className="px-2 py-0.5 bg-surface-container rounded-full text-xs text-on-surface-variant">{item.quantity}× {item.name}</span>
                    ))}
                    {order.items.length > 2 && <span className="text-xs text-on-surface-variant">+{order.items.length - 2}</span>}
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-on-surface-variant">{order.date}</td>
                <td className="px-5 py-4 font-extrabold text-primary">{order.total.toLocaleString('ar')} د.إ</td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${statusChip[order.status]}`}>{statusLabels[order.status]}</span>
                </td>
                <td className="px-5 py-4">
                  <Link href={`/customers/${order.customerId}` as any} className="text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
