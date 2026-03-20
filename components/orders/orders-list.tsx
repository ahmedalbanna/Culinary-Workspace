'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRealtime } from '@/hooks/use-realtime';
import type { Order } from '@/lib/types';

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  open:      { label: 'مفتوح',       color: 'bg-primary-container text-on-primary-container', dot: 'bg-primary animate-pulse' },
  served:    { label: 'تم التقديم', color: 'bg-blue-100 text-blue-700',                      dot: 'bg-blue-500' },
  paid:      { label: 'مدفوع',       color: 'bg-green-100 text-green-700',                    dot: 'bg-green-500' },
  cancelled: { label: 'ملغي',        color: 'bg-error-container text-error',                  dot: 'bg-error' },
  refunded:  { label: 'مُسترد',      color: 'bg-zinc-100 text-zinc-500',                      dot: 'bg-zinc-400' },
};

const FILTERS = ['الكل', 'مفتوح', 'تم التقديم', 'مدفوع', 'ملغي'] as const;
const FILTER_STATUS: Record<string, string> = {
  'مفتوح': 'open', 'تم التقديم': 'served', 'مدفوع': 'paid', 'ملغي': 'cancelled',
};

const SORTS = [
  { key: 'date-desc', label: 'الأحدث أولاً' },
  { key: 'date-asc',  label: 'الأقدم أولاً' },
  { key: 'total-desc', label: 'الأعلى قيمة' },
  { key: 'total-asc',  label: 'الأقل قيمة' },
];

const fmt = (n: number) =>
  new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(n);

interface Props {
  initialOrders: Order[];
}

export function OrdersList({ initialOrders }: Props) {
  const [orders, setOrders]       = useState<Order[]>(initialOrders);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('الكل');
  const [sort, setSort]           = useState('date-desc');
  const [liveUpdate, setLiveUpdate] = useState<string | null>(null);

  // Real-time order updates via SSE
  useRealtime({
    'order:updated': useCallback((payload: unknown) => {
      const updated = payload as Order;
      setOrders(prev => {
        const exists = prev.some(o => o.id === updated.id);
        const next = exists
          ? prev.map(o => o.id === updated.id ? updated : o)
          : [updated, ...prev];
        return next;
      });
      setLiveUpdate(updated.id);
      setTimeout(() => setLiveUpdate(null), 3000);
    }, []),
  });

  const filtered = useMemo(() => {
    let list = [...orders];

    // Status filter
    if (filter !== 'الكل') {
      const s = FILTER_STATUS[filter];
      list = list.filter(o => o.status === s);
    }

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(o =>
        o.guestName.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.tableLabel.toLowerCase().includes(q) ||
        o.items.some(i => i.nameAr.includes(q) || i.name.toLowerCase().includes(q))
      );
    }

    // Sort
    list.sort((a, b) => {
      const da = `${a.date}T${a.time}`;
      const db = `${b.date}T${b.time}`;
      if (sort === 'date-desc') return db.localeCompare(da);
      if (sort === 'date-asc')  return da.localeCompare(db);
      if (sort === 'total-desc') return b.total - a.total;
      if (sort === 'total-asc')  return a.total - b.total;
      return 0;
    });

    return list;
  }, [orders, search, filter, sort]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const o of orders) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  return (
    <div className="space-y-4">
      {/* Live update banner */}
      {liveUpdate && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary-container/60 text-primary text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
          تحديث مباشر — تم تحديث الطلب {liveUpdate}
          <span className="material-symbols-outlined text-base ms-auto">sync</span>
        </div>
      )}

      {/* Controls bar */}
      <div className="card-low p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث باسم الضيف، الطاولة، أو الطبق..."
            className="input-field ps-10 py-2.5 text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="input-field py-2.5 px-3 text-sm sm:w-44 flex-shrink-0"
        >
          {SORTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => {
          const statusKey = FILTER_STATUS[f];
          const count = f === 'الكل' ? orders.length : (counts[statusKey] ?? 0);
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                filter === f
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/30'
              }`}
            >
              {f === 'مفتوح' && filter !== f && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
              {f}
              <span className={`text-[10px] ${filter === f ? 'text-white/70' : 'text-on-surface-variant/60'}`}>({count})</span>
            </button>
          );
        })}
        {(search || filter !== 'الكل') && (
          <button
            onClick={() => { setSearch(''); setFilter('الكل'); }}
            className="px-3 py-2 rounded-full text-xs font-bold text-error bg-error-container/40 hover:bg-error-container transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">filter_alt_off</span>
            مسح الكل
          </button>
        )}
      </div>

      {/* Results count */}
      {(search || filter !== 'الكل') && (
        <p className="text-xs text-on-surface-variant px-1">
          عرض <span className="font-bold text-on-surface">{filtered.length}</span> من {orders.length} طلب
        </p>
      )}

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-3">search_off</span>
          <p className="text-on-surface-variant">لا توجد طلبات تطابق بحثك</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const sc = STATUS_CONFIG[order.status];
            const isLive = order.id === liveUpdate;
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}` as any}
                className={`card surface-container-lowest p-5 flex items-center gap-5 hover:-translate-y-0.5 transition-all duration-300 group block ${
                  isLive ? 'ring-2 ring-primary ring-offset-1' : ''
                }`}
              >
                {/* Status dot */}
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${sc.dot}`} />

                {/* Guest + table */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold truncate">{order.guestName}</h4>
                    {order.notes && (
                      <span className="material-symbols-outlined text-primary text-sm" title={order.notes}>sticky_note_2</span>
                    )}
                    {isLive && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-primary text-white animate-pulse">جديد</span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    {order.date} · {order.time} · طاولة {order.tableLabel} · {order.partySize} أفراد
                  </p>
                </div>

                {/* Item emojis */}
                <div className="hidden md:flex -space-x-1 space-x-reverse">
                  {order.items.slice(0, 4).map(item => (
                    <div
                      key={item.id}
                      className="w-8 h-8 rounded-full bg-surface-container border-2 border-white flex items-center justify-center text-sm shadow-sm"
                      title={item.nameAr}
                    >
                      {item.emoji}
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-surface-container border-2 border-white flex items-center justify-center text-[10px] font-bold text-on-surface-variant shadow-sm">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                {/* Total + status badge */}
                <div className="text-left flex-shrink-0 space-y-1">
                  <p className="font-black text-primary">{fmt(order.total)}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black block text-center ${sc.color}`}>
                    {sc.label}
                  </span>
                </div>

                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_left</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
