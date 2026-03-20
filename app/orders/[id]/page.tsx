import { getOrder } from '@/lib/orders-store';
import { getCustomer } from '@/lib/store';
import { OrderStatusControl } from '@/components/orders/order-status-control';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  open:      { label: 'مفتوح',      color: 'bg-primary-container text-on-primary-container' },
  served:    { label: 'تم التقديم', color: 'bg-blue-100 text-blue-700' },
  paid:      { label: 'مدفوع',      color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'ملغي',       color: 'bg-error-container text-error' },
  refunded:  { label: 'مُسترد',     color: 'bg-zinc-100 text-zinc-500' },
};

const PAY_LABEL: Record<string, string> = {
  cash: 'نقداً', card: 'بطاقة', 'apple-pay': 'Apple Pay', split: 'مقسم',
};

const ZONE_LABEL: Record<string, string> = {
  'Patio': 'التراس', 'Window': 'النوافذ', 'Main Hall': 'القاعة', 'Chef Counter': 'الشيف',
};

const fmt = (n: number) => new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 2 }).format(n);

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = getOrder(params.id);
  if (!order) notFound();

  const customer = getCustomer(order.customerId);
  const sc = STATUS_CONFIG[order.status];

  // Group items by category
  const categories = [...new Set(order.items.map(i => i.category))];

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-32">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/orders" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <div>
            <h2 className="headline-sm">طلب #{order.id.split('_')[1]}</h2>
            <p className="body-md text-on-surface-variant">{order.date} · {order.time}</p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-black ${sc.color}`}>{sc.label}</span>
      </header>

      {/* Guest + Table strip */}
      <div className="card surface-container-lowest p-6 flex flex-col sm:flex-row gap-6 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center text-primary text-2xl font-black flex-shrink-0">
            {order.guestName.charAt(0)}
          </div>
          <div>
            <h3 className="font-black text-lg">{order.guestName}</h3>
            {customer && (
              <Link href={`/customers/${customer.id}` as any} className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">open_in_new</span>
                عرض ملف العميل
              </Link>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[10px] text-on-surface-variant uppercase">الطاولة</p>
            <p className="font-black">{order.tableLabel}</p>
            <p className="text-[10px] text-on-surface-variant">{ZONE_LABEL[order.zone]}</p>
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant uppercase">الأفراد</p>
            <p className="font-black">{order.partySize}</p>
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant uppercase">النادل</p>
            <p className="font-black text-sm">{order.serverName}</p>
          </div>
        </div>
      </div>

      {/* POS line items */}
      <div className="card surface-container-lowest overflow-hidden">
        <div className="p-5 border-b border-outline-variant">
          <h3 className="title-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">receipt_long</span>
            تفاصيل الطلب
          </h3>
        </div>

        {categories.map(cat => (
          <div key={cat}>
            <div className="px-5 py-2 bg-surface-container-low">
              <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">{cat}</p>
            </div>
            {order.items.filter(i => i.category === cat).map(item => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4 border-b border-outline-variant last:border-0 hover:bg-surface-container-low transition-colors">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-2xl flex-shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold">{item.nameAr}</p>
                  {item.note && (
                    <p className="text-xs text-primary italic flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">info</span>
                      {item.note}
                    </p>
                  )}
                  <p className="text-xs text-on-surface-variant">{fmt(item.unitPrice)} × {item.quantity}</p>
                </div>
                <p className="font-black text-on-surface flex-shrink-0">{fmt(item.unitPrice * item.quantity)}</p>
              </div>
            ))}
          </div>
        ))}

        {/* Totals */}
        <div className="p-5 space-y-3 bg-surface-container-low">
          {[
            { label: 'المجموع الفرعي', value: order.subtotal },
            { label: 'ضريبة القيمة المضافة (5%)', value: order.tax },
            ...(order.discount > 0 ? [{ label: 'خصم', value: -order.discount }] : []),
          ].map(row => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-on-surface-variant">{row.label}</span>
              <span className={`font-bold ${row.value < 0 ? 'text-green-600' : ''}`}>
                {row.value < 0 ? '-' : ''}{fmt(Math.abs(row.value))}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-3 border-t border-outline-variant">
            <span className="font-black text-lg">الإجمالي</span>
            <span className="font-black text-2xl text-primary">{fmt(order.total)}</span>
          </div>
          {order.paymentMethod && (
            <div className="flex justify-between text-sm pt-1">
              <span className="text-on-surface-variant">طريقة الدفع</span>
              <span className="font-bold">{PAY_LABEL[order.paymentMethod]}</span>
            </div>
          )}
          {order.paidAt && (
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">وقت الدفع</span>
              <span className="font-bold">{order.paidAt}</span>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="card surface-container-lowest p-5 border-r-4 border-primary flex items-start gap-3">
          <span className="material-symbols-outlined text-primary">sticky_note_2</span>
          <p className="text-sm text-on-surface-variant">{order.notes}</p>
        </div>
      )}

      {/* Reservation link */}
      {order.reservationId && (
        <Link href={`/reservations/${order.reservationId}` as any} className="card surface-container-lowest p-5 flex items-center justify-between group hover:bg-surface-container-low transition-colors">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">event_available</span>
            <div>
              <p className="font-bold text-sm">الحجز المرتبط</p>
              <p className="text-xs text-on-surface-variant">#{order.reservationId}</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_left</span>
        </Link>
      )}

      {/* Status control */}
      {(order.status === 'open' || order.status === 'served') && (
        <OrderStatusControl orderId={order.id} currentStatus={order.status} total={order.total} />
      )}
    </div>
  );
}
