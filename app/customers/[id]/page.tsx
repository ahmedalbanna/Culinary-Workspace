import { getCustomer, listReservations } from '@/lib/store';
import { getOrdersByCustomer } from '@/lib/orders-store';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const STATUS_LABEL: Record<string, string> = { confirmed: 'مؤكد', seated: 'جالس', completed: 'مكتمل', waitlist: 'انتظار' };
const STATUS_COLOR: Record<string, string> = { confirmed: 'bg-green-100 text-green-700', seated: 'bg-primary-container text-on-primary-container', completed: 'bg-zinc-100 text-zinc-500', waitlist: 'bg-amber-100 text-amber-700' };
const fmt = (n: number) => new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(n);

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = getCustomer(params.id);
  if (!customer) notFound();

  const reservations = listReservations().filter(r => r.customerId === customer.id);
  const orders = getOrdersByCustomer(customer.id);

  const paidOrders = orders.filter(o => o.status === 'paid');
  const totalSpend = paidOrders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = paidOrders.length ? Math.round(totalSpend / paidOrders.length) : 0;

  // Top items this customer orders
  const itemCounts: Record<string, { nameAr: string; emoji: string; count: number }> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!itemCounts[item.name]) itemCounts[item.name] = { nameAr: item.nameAr, emoji: item.emoji, count: 0 };
      itemCounts[item.name].count += item.quantity;
    });
  });
  const topItems = Object.values(itemCounts).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/customers" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <div>
            <h2 className="headline-sm">ملف العميل</h2>
            <p className="body-md text-on-surface-variant">{customer.email}</p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-black ${customer.tier === 'VIP' ? 'bg-primary-container text-primary' : customer.tier === 'Loyal' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'}`}>
          {customer.tier === 'VIP' ? '⭐ VIP' : customer.tier === 'Loyal' ? 'وفاء' : 'جديد'}
        </span>
      </header>

      {/* Hero profile card */}
      <div className="card p-8 flex flex-col md:flex-row items-center md:items-start gap-8" style={{ background: 'linear-gradient(135deg,rgba(148,74,0,0.08),rgba(230,126,34,0.05))' }}>
        <div className="w-24 h-24 rounded-3xl bg-primary-container flex items-center justify-center text-primary text-4xl font-black flex-shrink-0">
          {customer.name.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-right space-y-3">
          <div>
            <h3 className="display-md">{customer.name}</h3>
            <p className="body-md text-on-surface-variant">{customer.phone}</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {customer.allergies.filter(a => a !== 'None').map(a => (
              <span key={a} className="flex items-center gap-1 px-3 py-1 rounded-full bg-error-container text-error text-xs font-bold">
                <span className="material-symbols-outlined text-xs">warning</span>{a}
              </span>
            ))}
            {customer.favoriteTable && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold">
                <span className="material-symbols-outlined text-xs">table_bar</span>طاولة {customer.favoriteTable} المفضلة
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
            <p className="text-2xl font-black text-primary">{fmt(totalSpend || customer.lifetimeSpend)}</p>
            <p className="text-[10px] text-on-surface-variant uppercase">إجمالي الإنفاق</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
            <p className="text-2xl font-black">{reservations.length}</p>
            <p className="text-[10px] text-on-surface-variant uppercase">زيارة</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
            <p className="text-2xl font-black">{fmt(avgOrderValue)}</p>
            <p className="text-[10px] text-on-surface-variant uppercase">متوسط الطلب</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
            <p className="text-2xl font-black">{paidOrders.length}</p>
            <p className="text-[10px] text-on-surface-variant uppercase">طلب مدفوع</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Order history */}
          {orders.length > 0 && (
            <div className="card surface-container-lowest overflow-hidden">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                <h3 className="title-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">receipt_long</span>
                  تاريخ الطلبات
                </h3>
                <span className="label-md text-on-surface-variant">{orders.length} طلب</span>
              </div>
              <div className="divide-y divide-outline-variant">
                {orders.map(order => (
                  <Link key={order.id} href={`/orders/${order.id}` as any} className="flex items-center gap-4 p-5 hover:bg-surface-container-low transition-colors group">
                    <div className="flex -space-x-1 space-x-reverse flex-shrink-0">
                      {order.items.slice(0, 3).map(item => (
                        <div key={item.id} className="w-8 h-8 rounded-full bg-surface-container border-2 border-white flex items-center justify-center text-sm" title={item.nameAr}>
                          {item.emoji}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm">{order.date} · {order.time}</p>
                      <p className="text-xs text-on-surface-variant truncate">
                        {order.items.map(i => `${i.nameAr} ×${i.quantity}`).join(' · ')}
                      </p>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <p className="font-black text-primary">{fmt(order.total)}</p>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${order.status === 'paid' ? 'bg-green-100 text-green-700' : order.status === 'open' ? 'bg-primary-container text-on-primary-container' : 'bg-zinc-100 text-zinc-500'}`}>
                        {order.status === 'paid' ? 'مدفوع' : order.status === 'open' ? 'مفتوح' : order.status}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_left</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Reservation history */}
          <div className="card surface-container-lowest p-6 space-y-4">
            <h3 className="title-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
              تاريخ الحجوزات
            </h3>
            <div className="space-y-3">
              {reservations.length > 0 ? reservations.map(res => (
                <Link key={res.id} href={`/reservations/${res.id}` as any} className="flex justify-between items-center p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-colors group">
                  <div>
                    <p className="font-bold">{res.date}</p>
                    <p className="text-xs text-on-surface-variant">{res.time} · طاولة {res.tableLabel} · {res.partySize} أفراد{res.occasion ? ` · ${res.occasion}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${STATUS_COLOR[res.status]}`}>{STATUS_LABEL[res.status]}</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_left</span>
                  </div>
                </Link>
              )) : (
                <p className="text-on-surface-variant text-sm">لا توجد حجوزات سابقة</p>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-8">
          {/* Top items */}
          {topItems.length > 0 && (
            <div className="card surface-container-lowest p-6 space-y-4">
              <h3 className="title-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">favorite</span>
                الأطباق المفضلة
              </h3>
              <div className="space-y-3">
                {topItems.map((item, idx) => (
                  <div key={item.nameAr} className="flex items-center gap-3">
                    <span className="text-xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{item.nameAr}</p>
                      <div className="h-1.5 bg-surface-container rounded-full mt-1 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.round((item.count / topItems[0].count) * 100)}%`, background: 'linear-gradient(90deg,#944A00,#E67E22)', opacity: 1 - idx * 0.15 }} />
                      </div>
                    </div>
                    <span className="text-xs font-black text-primary">{item.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preferences */}
          <div className="card surface-container-lowest p-6 space-y-4">
            <h3 className="title-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">tune</span>
              التفضيلات
            </h3>
            {customer.preferences.map(p => (
              <div key={p.label} className="p-3 bg-surface-container-low rounded-xl">
                <p className="label-md font-bold text-primary text-xs uppercase">{p.label}</p>
                <p className="text-sm mt-1">{p.detail}</p>
              </div>
            ))}
          </div>

          {/* Active offers */}
          {customer.offers.length > 0 && (
            <div className="card surface-container-lowest p-6 space-y-4">
              <h3 className="title-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_offer</span>
                العروض المقترحة
              </h3>
              {customer.offers.map(offer => (
                <div key={offer.id} className="p-4 rounded-2xl space-y-2" style={{ background: 'linear-gradient(135deg,rgba(148,74,0,0.08),rgba(230,126,34,0.05))' }}>
                  <p className="font-bold text-sm">{offer.title}</p>
                  <p className="text-xs text-on-surface-variant">{offer.reason}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">{offer.channel === 'sms' ? 'sms' : offer.channel === 'email' ? 'mail' : 'sticky_note_2'}</span>
                      {offer.channel}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">ينتهي {offer.expiresAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
