'use client';

import { useState, useCallback } from 'react';
import { useRealtime } from '@/hooks/use-realtime';
import type { Reservation, RestaurantTable } from '@/lib/types';
import type { Order } from '@/lib/types';

interface Props {
  initialReservations: Reservation[];
  initialTodayCovers: number;
  initialProjectedRevenue: number;
  initialVipArrivals: number;
  initialOpenOrders: number;
  initialNeedsCleaning: number;
}

function formatAED(n: number) {
  return new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(n);
}

export function DashboardKPIs({
  initialReservations,
  initialTodayCovers,
  initialProjectedRevenue,
  initialVipArrivals,
  initialOpenOrders,
  initialNeedsCleaning,
}: Props) {
  const [reservationCount, setReservationCount]   = useState(initialReservations.length);
  const [todayCovers, setTodayCovers]             = useState(initialTodayCovers);
  const [projectedRevenue, setProjectedRevenue]   = useState(initialProjectedRevenue);
  const [vipArrivals, setVipArrivals]             = useState(initialVipArrivals);
  const [openOrders, setOpenOrders]               = useState(initialOpenOrders);
  const [needsCleaning, setNeedsCleaning]         = useState(initialNeedsCleaning);
  const [lastEvent, setLastEvent]                 = useState<string | null>(null);

  const flash = (msg: string) => {
    setLastEvent(msg);
    setTimeout(() => setLastEvent(null), 4000);
  };

  useRealtime({
    'reservation:updated': useCallback((payload: unknown) => {
      const res = payload as Reservation;
      if (res.status === 'seated') {
        setTodayCovers(prev => prev + res.partySize);
        flash(`حجز جديد — ${res.guestName} وصل`);
      }
      if (res.status === 'confirmed') {
        setReservationCount(prev => prev + 1);
        flash(`حجز مؤكد جديد — ${res.guestName}`);
      }
    }, []),

    'order:updated': useCallback((payload: unknown) => {
      const order = payload as Order;
      if (order.status === 'open') {
        setOpenOrders(prev => prev + 1);
        flash(`طلب جديد — طاولة ${order.tableLabel}`);
      } else if (order.status === 'paid') {
        setOpenOrders(prev => Math.max(0, prev - 1));
        setProjectedRevenue(prev => prev + order.total);
        flash(`دفع مكتمل — ${formatAED(order.total)}`);
      }
    }, []),

    'table:updated': useCallback((payload: unknown) => {
      const table = payload as RestaurantTable;
      if (table.status === 'needs-cleaning') {
        setNeedsCleaning(prev => prev + 1);
        flash(`طاولة ${table.label} تحتاج تنظيف`);
      } else if (table.status === 'available') {
        setNeedsCleaning(prev => Math.max(0, prev - 1));
      }
    }, []),
  });

  const metrics = [
    {
      label: 'الحجوزات اليوم',
      value: reservationCount,
      icon: 'event_available',
      color: 'text-primary',
      bg: 'bg-primary-container/40',
      trend: '+12%',
      href: '/reservations',
    },
    {
      label: 'إجمالي الزوار',
      value: todayCovers,
      icon: 'groups',
      color: 'text-secondary',
      bg: 'bg-secondary-container',
      trend: null,
      href: '/reservations',
    },
    {
      label: 'الإيراد المتوقع',
      value: formatAED(projectedRevenue),
      icon: 'payments',
      color: 'text-green-700',
      bg: 'bg-green-100',
      trend: '+5%',
      href: '/orders',
    },
    {
      label: 'ضيوف VIP اليوم',
      value: vipArrivals,
      icon: 'star',
      color: 'text-yellow-700',
      bg: 'bg-amber-100',
      trend: null,
      href: '/customers',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Live event ticker */}
      {lastEvent && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary-container/60 text-primary text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
          {lastEvent}
          <span className="material-symbols-outlined text-base ms-auto">sync</span>
        </div>
      )}

      {/* KPI cards */}
      <div className="metrics-grid">
        {metrics.map((m) => (
          <a key={m.label} href={m.href} className="metric-card group hover:-translate-y-1 transition-transform duration-300 block">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{m.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.bg}`}>
                <span className={`material-symbols-outlined text-xl ${m.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-on-surface tracking-tight tabular-nums">{m.value}</p>
              {m.trend && (
                <p className="text-xs font-bold text-green-700 flex items-center gap-0.5 mt-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span> {m.trend} من الأمس
                </p>
              )}
            </div>
          </a>
        ))}
      </div>

      {/* Alert chips */}
      {(openOrders > 0 || needsCleaning > 0) && (
        <div className="flex gap-3 flex-wrap">
          {openOrders > 0 && (
            <a href="/orders" className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container text-primary text-xs font-bold hover:bg-primary hover:text-white transition-colors">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {openOrders} طلب مفتوح
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </a>
          )}
          {needsCleaning > 0 && (
            <a href="/tables" className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-xs font-bold hover:bg-amber-200 transition-colors">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>cleaning_services</span>
              {needsCleaning} طاولة تحتاج تنظيف
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
