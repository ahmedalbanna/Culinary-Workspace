'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Order, OrderLineItem, MenuItem, Customer } from '@/lib/types';
import { OrderStatusControl } from '@/components/orders/order-status-control';

const fmt = (n: number) =>
  new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 2 }).format(n);

const PAY_LABEL: Record<string, string> = {
  cash: 'نقداً', card: 'بطاقة', 'apple-pay': 'Apple Pay', split: 'مقسم',
};
const ZONE_LABEL: Record<string, string> = {
  Patio: 'التراس', Window: 'النوافذ', 'Main Hall': 'القاعة', 'Chef Counter': 'الشيف',
};
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  open:      { label: 'مفتوح',      color: 'bg-primary-container text-on-primary-container' },
  served:    { label: 'تم التقديم', color: 'bg-blue-100 text-blue-700' },
  paid:      { label: 'مدفوع',      color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'ملغي',       color: 'bg-error-container text-error' },
  refunded:  { label: 'مُسترد',     color: 'bg-zinc-100 text-zinc-500' },
};

type Panel = 'none' | 'add-items' | 'split-bill';

interface Props {
  order: Order;
  customer: Customer | undefined;
  menuItems: MenuItem[];
}

export function OrderDetailClient({ order: initialOrder, customer, menuItems }: Props) {
  const router = useRouter();
  const [order, setOrder]         = useState<Order>(initialOrder);
  const [panel, setPanel]         = useState<Panel>('none');
  const [saving, setSaving]       = useState(false);
  const [savedMsg, setSavedMsg]   = useState('');
  const [noteEdit, setNoteEdit]   = useState<string | null>(null);
  const [noteVal, setNoteVal]     = useState('');
  // Add items state
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCat, setMenuCat]     = useState('الكل');
  // Split bill state
  const [splitGuests, setSplitGuests] = useState(order.partySize);
  const [splitItems, setSplitItems]   = useState<Record<string, number>>({});

  const isEditable = order.status === 'open' || order.status === 'served';
  const sc = STATUS_CONFIG[order.status];

  // ─── Helpers ────────────────────────────────────────────────────────────────

  async function patchOrder(body: object) {
    setSaving(true);
    const res = await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.order) {
      setOrder(data.order);
      setSavedMsg('تم الحفظ');
      setTimeout(() => setSavedMsg(''), 2000);
    }
    setSaving(false);
    return data.order as Order | undefined;
  }

  // ─── Item quantity ───────────────────────────────────────────────────────────

  async function changeQty(itemId: string, delta: number) {
    const next = order.items
      .map(i => i.id === itemId ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0);
    await patchOrder({ items: next });
  }

  // ─── Item note ───────────────────────────────────────────────────────────────

  async function saveNote(itemId: string) {
    const next = order.items.map(i => i.id === itemId ? { ...i, note: noteVal || undefined } : i);
    await patchOrder({ items: next });
    setNoteEdit(null);
  }

  // ─── Add item from menu ──────────────────────────────────────────────────────

  async function addMenuItem(menuItem: MenuItem) {
    await patchOrder({
      addItem: {
        name: menuItem.nameEn,
        nameAr: menuItem.nameAr,
        category: menuItem.category,
        quantity: 1,
        unitPrice: menuItem.price,
        emoji: menuItem.emoji,
      },
    });
  }

  // ─── Split bill calculations ──────────────────────────────────────────────────

  const perPerson = order.total / splitGuests;

  function splitItemGuests(itemId: string, guests: number) {
    setSplitItems(prev => ({ ...prev, [itemId]: guests }));
  }

  // ─── Filtered menu ───────────────────────────────────────────────────────────

  const cats = ['الكل', ...Array.from(new Set(menuItems.map(m => m.category)))];
  const filteredMenu = menuItems.filter(m =>
    m.status === 'available' &&
    (menuCat === 'الكل' || m.category === menuCat) &&
    (menuSearch === '' || m.nameAr.includes(menuSearch) || m.nameEn.toLowerCase().includes(menuSearch.toLowerCase()))
  );

  // ─── Render ──────────────────────────────────────────────────────────────────

  const categories = [...new Set(order.items.map(i => i.category))];

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-32">
      {/* Header */}
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
        <div className="flex items-center gap-2">
          {savedMsg && (
            <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1 animate-in fade-in">
              <span className="material-symbols-outlined text-sm">check_circle</span>{savedMsg}
            </span>
          )}
          {saving && <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>}
          <span className={`px-4 py-2 rounded-full text-sm font-black ${sc.color}`}>{sc.label}</span>
        </div>
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
          {[
            { label: 'الطاولة', value: order.tableLabel, sub: ZONE_LABEL[order.zone] ?? order.zone },
            { label: 'الأفراد', value: order.partySize.toString(), sub: null },
            { label: 'النادل',  value: order.serverName, sub: null },
          ].map(d => (
            <div key={d.label}>
              <p className="text-[10px] text-on-surface-variant uppercase">{d.label}</p>
              <p className="font-black text-sm">{d.value}</p>
              {d.sub && <p className="text-[10px] text-on-surface-variant">{d.sub}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* POS line items */}
      <div className="card surface-container-lowest overflow-hidden">
        <div className="p-5 border-b border-outline-variant flex items-center justify-between gap-3">
          <h3 className="title-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">receipt_long</span>
            تفاصيل الطلب
          </h3>
          {isEditable && (
            <button
              onClick={() => setPanel(p => p === 'add-items' ? 'none' : 'add-items')}
              className="btn-primary text-sm py-2 px-4 rounded-full"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              إضافة صنف
            </button>
          )}
        </div>

        {categories.map(cat => (
          <div key={cat}>
            <div className="px-5 py-2 bg-surface-container-low">
              <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">{cat}</p>
            </div>
            {order.items.filter(i => i.category === cat).map(item => (
              <div key={item.id} className="px-5 py-4 border-b border-outline-variant/30 last:border-0 hover:bg-surface-container-low/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-2xl flex-shrink-0">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">{item.nameAr}</p>
                    <p className="text-xs text-on-surface-variant">{fmt(item.unitPrice)} × {item.quantity}</p>
                    {/* Note display / edit */}
                    {noteEdit === item.id ? (
                      <div className="flex items-center gap-2 mt-1.5">
                        <input
                          autoFocus
                          value={noteVal}
                          onChange={e => setNoteVal(e.target.value)}
                          placeholder="أضف ملاحظة..."
                          className="flex-1 text-xs border border-outline-variant rounded-lg px-2 py-1 bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                          onKeyDown={e => { if (e.key === 'Enter') saveNote(item.id); if (e.key === 'Escape') setNoteEdit(null); }}
                        />
                        <button onClick={() => saveNote(item.id)} className="text-primary">
                          <span className="material-symbols-outlined text-sm">check</span>
                        </button>
                        <button onClick={() => setNoteEdit(null)} className="text-on-surface-variant">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setNoteEdit(item.id); setNoteVal(item.note ?? ''); }}
                        className="text-xs text-on-surface-variant/60 hover:text-primary flex items-center gap-0.5 mt-0.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">edit_note</span>
                        {item.note ? <span className="italic text-primary">{item.note}</span> : 'إضافة ملاحظة'}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p className="font-black text-on-surface">{fmt(item.unitPrice * item.quantity)}</p>
                    {isEditable && (
                      <div className="flex items-center gap-1 bg-surface-container rounded-full px-1 py-0.5">
                        <button
                          onClick={() => changeQty(item.id, -1)}
                          disabled={saving}
                          className="w-7 h-7 rounded-full hover:bg-error-container hover:text-error transition-colors flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="w-6 text-center text-sm font-black">{item.quantity}</span>
                        <button
                          onClick={() => changeQty(item.id, 1)}
                          disabled={saving}
                          className="w-7 h-7 rounded-full hover:bg-primary-container hover:text-primary transition-colors flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
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
        <div className="card surface-container-lowest p-5 border-s-4 border-primary flex items-start gap-3">
          <span className="material-symbols-outlined text-primary">sticky_note_2</span>
          <p className="text-sm text-on-surface-variant">{order.notes}</p>
        </div>
      )}

      {/* Reservation link */}
      {order.reservationId && (
        <Link href={`/reservations/${order.reservationId}` as any} className="card surface-container-lowest p-5 flex items-center justify-between group hover:bg-surface-container-low transition-colors block">
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

      {/* Split Bill button */}
      {isEditable && order.items.length > 0 && (
        <button
          onClick={() => setPanel(p => p === 'split-bill' ? 'none' : 'split-bill')}
          className="w-full card p-4 flex items-center gap-3 hover:bg-surface-container-low transition-colors text-right"
        >
          <div className="w-10 h-10 rounded-2xl bg-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary">call_split</span>
          </div>
          <div className="flex-1">
            <p className="font-bold">تقسيم الفاتورة</p>
            <p className="text-xs text-on-surface-variant">توزيع المبلغ على {order.partySize} أفراد</p>
          </div>
          <span className={`material-symbols-outlined transition-transform ${panel === 'split-bill' ? 'rotate-90' : ''} text-on-surface-variant`}>expand_more</span>
        </button>
      )}

      {/* ── ADD ITEMS PANEL ── */}
      {panel === 'add-items' && (
        <div className="card surface-container-lowest overflow-hidden">
          <div className="p-4 border-b border-outline-variant flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">restaurant_menu</span>
              إضافة أصناف
            </h3>
            <button onClick={() => setPanel('none')} className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          {/* Search */}
          <div className="p-4 space-y-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input
                type="text"
                value={menuSearch}
                onChange={e => setMenuSearch(e.target.value)}
                placeholder="ابحث في القائمة..."
                className="input-field ps-9 py-2.5 text-sm"
              />
            </div>

            {/* Category chips */}
            <div className="flex gap-2 flex-wrap">
              {cats.map(c => (
                <button
                  key={c}
                  onClick={() => setMenuCat(c)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${menuCat === c ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Menu items grid */}
          <div className="max-h-72 overflow-y-auto divide-y divide-outline-variant/20">
            {filteredMenu.map(menuItem => {
              const inOrder = order.items.find(i => i.name === menuItem.nameEn);
              return (
                <div key={menuItem.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-xl flex-shrink-0">
                    {menuItem.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{menuItem.nameAr}</p>
                    <p className="text-xs text-on-surface-variant">{fmt(menuItem.price)}</p>
                  </div>
                  {inOrder && (
                    <span className="text-[10px] font-bold text-primary bg-primary-container/30 px-2 py-0.5 rounded-full">×{inOrder.quantity}</span>
                  )}
                  <button
                    onClick={() => addMenuItem(menuItem)}
                    disabled={saving}
                    className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/80 transition-colors flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              );
            })}
            {filteredMenu.length === 0 && (
              <div className="p-8 text-center text-sm text-on-surface-variant">لا توجد أصناف متطابقة</div>
            )}
          </div>
        </div>
      )}

      {/* ── SPLIT BILL PANEL ── */}
      {panel === 'split-bill' && (
        <div className="card surface-container-lowest overflow-hidden">
          <div className="p-5 border-b border-outline-variant">
            <h3 className="font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">call_split</span>
              تقسيم الفاتورة
            </h3>
          </div>

          {/* Split mode tabs */}
          <div className="p-5 space-y-5">
            {/* Equal split */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">تقسيم متساوٍ</p>
                <div className="flex items-center gap-2 bg-surface-container rounded-full px-2 py-1">
                  <button onClick={() => setSplitGuests(g => Math.max(1, g - 1))} className="w-7 h-7 rounded-full hover:bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="w-6 text-center font-black text-sm">{splitGuests}</span>
                  <button onClick={() => setSplitGuests(g => g + 1)} className="w-7 h-7 rounded-full hover:bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              </div>

              {/* Per-person cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: splitGuests }, (_, i) => (
                  <div key={i} className="card p-4 text-center space-y-1">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase">الضيف {i + 1}</p>
                    <p className="text-xl font-extrabold text-primary">{fmt(perPerson)}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center px-1">
                <span className="text-xs text-on-surface-variant">الإجمالي: {fmt(order.total)}</span>
                <span className="text-xs font-bold text-primary">{splitGuests} أفراد × {fmt(perPerson)}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-outline-variant/30" />

            {/* Per-item split */}
            <div className="space-y-3">
              <p className="text-sm font-bold">تقسيم حسب الصنف</p>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {order.items.map(item => {
                  const guests = splitItems[item.id] ?? 1;
                  const perG   = (item.unitPrice * item.quantity) / guests;
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl">
                      <span className="text-xl">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{item.nameAr}</p>
                        <p className="text-[10px] text-on-surface-variant">{fmt(item.unitPrice * item.quantity)} ÷ {guests} = <span className="font-bold text-primary">{fmt(perG)}</span></p>
                      </div>
                      <div className="flex items-center gap-1 bg-surface-container rounded-full px-1">
                        <button onClick={() => splitItemGuests(item.id, Math.max(1, guests - 1))} className="w-6 h-6 rounded-full hover:bg-surface-container-high flex items-center justify-center">
                          <span className="material-symbols-outlined text-xs">remove</span>
                        </button>
                        <span className="w-5 text-center text-xs font-black">{guests}</span>
                        <button onClick={() => splitItemGuests(item.id, guests + 1)} className="w-6 h-6 rounded-full hover:bg-surface-container-high flex items-center justify-center">
                          <span className="material-symbols-outlined text-xs">add</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pay buttons */}
            <div className="pt-2 space-y-2">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">طريقة الدفع</p>
              <div className="grid grid-cols-2 gap-2">
                {(['cash', 'card', 'apple-pay', 'split'] as const).map(method => (
                  <button
                    key={method}
                    onClick={async () => {
                      await patchOrder({ status: 'paid', paymentMethod: method });
                      setPanel('none');
                      router.refresh();
                    }}
                    className="px-4 py-3 rounded-2xl bg-surface-container hover:bg-primary hover:text-white text-sm font-bold transition-colors flex items-center gap-2 justify-center"
                  >
                    <span className="material-symbols-outlined text-base">
                      {method === 'cash' ? 'payments' : method === 'card' ? 'credit_card' : method === 'apple-pay' ? 'phone_iphone' : 'call_split'}
                    </span>
                    {PAY_LABEL[method]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status control */}
      {isEditable && (
        <OrderStatusControl orderId={order.id} currentStatus={order.status} total={order.total} />
      )}
    </div>
  );
}
