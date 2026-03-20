import { getCustomer } from '@/lib/store';
import { getOrdersByCustomer } from '@/lib/orders-store';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const STATUS_LABEL: Record<string, string> = {
  open: 'مفتوح', served: 'قُدِّم', paid: 'مدفوع', cancelled: 'ملغى', refunded: 'مسترد',
};
const STATUS_COLOR: Record<string, string> = {
  open:      'bg-primary-container text-on-primary-container',
  served:    'bg-secondary-container text-secondary',
  paid:      'bg-green-100 text-green-700',
  cancelled: 'bg-error-container text-error',
  refunded:  'bg-zinc-100 text-zinc-500',
};

const fmt = (n: number) =>
  new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(n);

export default function CustomerOrdersPage({ params }: { params: { id: string } }) {
  const customer = getCustomer(params.id);
  if (!customer) notFound();

  const orders = getOrdersByCustomer(params.id);
  const paid   = orders.filter(o => o.status === 'paid');
  const total  = paid.reduce((s, o) => s + o.total, 0);
  const avg    = paid.length ? Math.round(total / paid.length) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">

      {/* Header */}
      <header className="flex items-center gap-4">
        <Link
          href={`/customers/${customer.id}` as any}
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors"
        >
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        <div>
          <h2 className="page-title">سجل الطلبات</h2>
          <p className="page-subtitle">{customer.name} · {orders.length} طلب</p>
        </div>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'إجمالي الطلبات',   value: orders.length.toString(), icon: 'receipt_long', color: 'text-primary',     bg: 'bg-primary-container/40' },
          { label: 'إجمالي الإنفاق',   value: fmt(total),               icon: 'payments',     color: 'text-green-700',   bg: 'bg-green-100' },
          { label: 'متوسط قيمة الطلب', value: fmt(avg),                 icon: 'analytics',    color: 'text-secondary',   bg: 'bg-secondary-container' },
        ].map(s => (
          <div key={s.label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <span className={`material-symbols-outlined text-2xl ${s.color}`}>{s.icon}</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium">{s.label}</p>
              <p className="text-2xl font-extrabold text-on-surface">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        <input
          type="text"
          placeholder="البحث برقم الطلب..."
          className="input-field ps-10 py-3 text-sm w-full"
        />
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-3">receipt_long</span>
          <p className="text-on-surface-variant">لا توجد طلبات سابقة لهذا العميل</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link
              key={order.id}
              href={`/orders/${order.id}` as any}
              className="card p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-5 hover:-translate-y-px hover:shadow-ambient transition-all duration-300 group block"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-3xl">receipt_long</span>
              </div>

              {/* Details grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div>
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">رقم الطلب</p>
                  <p className="font-bold text-on-surface">{order.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">التاريخ والوقت</p>
                  <p className="text-sm text-on-surface-variant font-medium">{order.date} · {order.time}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">الأصناف</p>
                  <p className="text-sm text-on-surface-variant truncate max-w-[200px]">
                    {order.items.map(i => `${i.nameAr} ×${i.quantity}`).join('، ')}
                  </p>
                </div>
                <div className="flex md:flex-col gap-3 md:gap-1 md:items-end">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLOR[order.status]}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {STATUS_LABEL[order.status]}
                  </span>
                  <span className="text-xl font-black text-primary">{fmt(order.total)}</span>
                </div>
              </div>

              <span className="material-symbols-outlined text-on-surface-variant/50 group-hover:text-primary transition-colors hidden md:block">chevron_left</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
