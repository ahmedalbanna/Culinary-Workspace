'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRealtime } from '@/hooks/use-realtime';
import { useSound } from '@/hooks/use-sound';
import Link from 'next/link';
import type { Order, Reservation, RestaurantTable } from '@/lib/types';

interface Notification {
  id: string;
  type: 'order' | 'reservation' | 'table';
  title: string;
  body: string;
  href: string;
  icon: string;
  iconColor: string;
  ts: Date;
  read: boolean;
}

function timeAgo(ts: Date): string {
  const sec = Math.floor((Date.now() - ts.getTime()) / 1000);
  if (sec < 60)  return 'الآن';
  if (sec < 3600) return `منذ ${Math.floor(sec / 60)} د`;
  return `منذ ${Math.floor(sec / 3600)} س`;
}

const ORDER_STATUS_AR: Record<string, string> = {
  open: 'طلب جديد', served: 'تم التقديم', paid: 'مدفوع', cancelled: 'ملغي', refunded: 'مُسترد',
};
const RES_STATUS_AR: Record<string, string> = {
  confirmed: 'حجز مؤكد', seated: 'وصل الضيف', completed: 'مكتمل', waitlist: 'قائمة انتظار',
};
const TABLE_STATUS_AR: Record<string, string> = {
  available: 'متاحة', occupied: 'مشغولة', reserved: 'محجوزة',
  'needs-cleaning': 'تحتاج تنظيف', closed: 'مغلقة',
};

export function NotificationsPanel() {
  const [open, setOpen]           = useState(false);
  const [notifications, setNotes] = useState<Notification[]>([]);
  const [soundOn, setSoundOn]     = useState(true);
  const panelRef                  = useRef<HTMLDivElement>(null);
  const { play, setEnabled }      = useSound();

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function addNote(note: Omit<Notification, 'id' | 'ts' | 'read'>) {
    setNotes(prev => [
      { ...note, id: `n_${Date.now()}`, ts: new Date(), read: false },
      ...prev.slice(0, 29), // max 30 notifications
    ]);
  }

  useRealtime({
    'order:updated': useCallback((payload: unknown) => {
      const order = payload as Order;
      const isNew = order.status === 'open';
      if (isNew) play('order');
      else if (order.status === 'paid') play('success');
      addNote({
        type: 'order',
        title: ORDER_STATUS_AR[order.status] ?? order.status,
        body: `طاولة ${order.tableLabel} · ${order.guestName} · ${new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(order.total)}`,
        href: `/orders/${order.id}`,
        icon: order.status === 'open' ? 'restaurant' : order.status === 'paid' ? 'payments' : 'receipt_long',
        iconColor: order.status === 'open' ? 'bg-primary-container text-primary' : order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-surface-container text-on-surface-variant',
      });
    }, [play]),

    'reservation:updated': useCallback((payload: unknown) => {
      const res = payload as Reservation;
      if (res.status === 'seated') play('reservation');
      addNote({
        type: 'reservation',
        title: RES_STATUS_AR[res.status] ?? res.status,
        body: `${res.guestName} · طاولة ${res.tableLabel} · ${res.time}`,
        href: `/reservations/${res.id}`,
        icon: res.status === 'seated' ? 'person_check' : 'event_available',
        iconColor: res.status === 'seated' ? 'bg-green-100 text-green-700' : 'bg-primary-container text-primary',
      });
    }, [play]),

    'table:updated': useCallback((payload: unknown) => {
      const table = payload as RestaurantTable;
      if (table.status === 'needs-cleaning') play('table');
      addNote({
        type: 'table',
        title: `طاولة ${table.label} — ${TABLE_STATUS_AR[table.status] ?? table.status}`,
        body: `المنطقة: ${table.zone} · ${table.seats} مقاعد`,
        href: `/tables/${table.id}`,
        icon: table.status === 'needs-cleaning' ? 'cleaning_services' : 'table_bar',
        iconColor: table.status === 'needs-cleaning' ? 'bg-amber-100 text-amber-700' : 'bg-secondary-container text-secondary',
      });
    }, [play]),
  });

  const unread = notifications.filter(n => !n.read).length;

  function markAllRead() {
    setNotes(prev => prev.map(n => ({ ...n, read: true })));
  }

  function toggleSound() {
    setSoundOn(prev => {
      setEnabled(!prev);
      return !prev;
    });
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => { setOpen(o => !o); if (!open) markAllRead(); }}
        className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors"
        title="الإشعارات"
      >
        <span className="material-symbols-outlined text-on-surface-variant text-xl">notifications</span>
        {unread > 0 && (
          <span className="absolute top-0.5 end-0.5 min-w-[16px] h-4 rounded-full bg-error text-white text-[9px] font-black flex items-center justify-center px-0.5">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute top-full end-0 mt-2 w-80 rounded-3xl shadow-ambient bg-surface-container-lowest border border-outline-variant/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">notifications_active</span>
              <span className="font-bold text-sm">الإشعارات</span>
              {notifications.length > 0 && (
                <span className="text-[10px] text-on-surface-variant">({notifications.length})</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Sound toggle */}
              <button
                onClick={toggleSound}
                title={soundOn ? 'إيقاف الصوت' : 'تشغيل الصوت'}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${soundOn ? 'text-primary bg-primary-container/40' : 'text-on-surface-variant bg-surface-container'}`}
              >
                <span className="material-symbols-outlined text-sm">{soundOn ? 'volume_up' : 'volume_off'}</span>
              </button>
              {notifications.length > 0 && (
                <button onClick={markAllRead} className="text-[10px] font-bold text-primary hover:underline">
                  قراءة الكل
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-outline-variant/10">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 block mb-2">notifications_off</span>
                <p className="text-sm text-on-surface-variant">لا توجد إشعارات حديثة</p>
                <p className="text-xs text-on-surface-variant/60 mt-1">ستظهر هنا تلقائياً عند حدوث تغييرات</p>
              </div>
            ) : (
              notifications.map(note => (
                <Link
                  key={note.id}
                  href={note.href as any}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors block ${!note.read ? 'bg-primary-fixed/10' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${note.iconColor}`}>
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{note.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-on-surface leading-tight">{note.title}</p>
                      <span className="text-[9px] text-on-surface-variant whitespace-nowrap flex-shrink-0">{timeAgo(note.ts)}</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 truncate">{note.body}</p>
                  </div>
                  {!note.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                  )}
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-outline-variant/20 flex justify-between items-center">
              <button
                onClick={() => setNotes([])}
                className="text-[10px] text-on-surface-variant hover:text-error transition-colors font-bold"
              >
                مسح الكل
              </button>
              <span className="text-[10px] text-on-surface-variant">
                {soundOn ? '🔔 صوت التنبيه مفعّل' : '🔕 صوت التنبيه معطّل'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
