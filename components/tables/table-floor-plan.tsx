'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { RestaurantTable, TableStatus, TableZone } from '@/lib/types';

const STATUS_CONFIG: Record<TableStatus, { label: string; bg: string; text: string; ring: string; dot: string }> = {
  available: { label: 'متاحة', bg: 'bg-green-50', text: 'text-green-800', ring: 'ring-green-200', dot: 'bg-green-500' },
  occupied: { label: 'مشغولة', bg: 'bg-primary-container/60', text: 'text-on-primary-container', ring: 'ring-primary/30', dot: 'bg-primary' },
  reserved: { label: 'محجوزة', bg: 'bg-amber-50', text: 'text-amber-800', ring: 'ring-amber-200', dot: 'bg-amber-500' },
  'needs-cleaning': { label: 'تحتاج تنظيف', bg: 'bg-zinc-100', text: 'text-zinc-600', ring: 'ring-zinc-300', dot: 'bg-zinc-400' },
  closed: { label: 'مغلقة', bg: 'bg-zinc-50', text: 'text-zinc-400', ring: 'ring-zinc-100', dot: 'bg-zinc-300' },
};

const ZONE_LABELS: Record<TableZone, string> = {
  Patio: 'التراس الخارجي',
  Window: 'منطقة النوافذ',
  'Main Hall': 'القاعة الرئيسية',
  'Chef Counter': 'طاولة الشيف',
};

interface Props {
  tables: RestaurantTable[];
  summary: {
    total: number;
    available: number;
    occupied: number;
    reserved: number;
    needsCleaning: number;
    closed: number;
    occupancyRate: number;
  };
}

export function TableFloorPlan({ tables: initialTables, summary: initialSummary }: Props) {
  const router = useRouter();
  const [tables, setTables] = useState(initialTables);
  const [summary, setSummary] = useState(initialSummary);
  const [activeZone, setActiveZone] = useState<TableZone | 'all'>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  const zones: (TableZone | 'all')[] = ['all', 'Main Hall', 'Patio', 'Window', 'Chef Counter'];

  const filtered = activeZone === 'all' ? tables : tables.filter(t => t.zone === activeZone);

  const grouped = zones.slice(1).reduce<Record<string, RestaurantTable[]>>((acc, zone) => {
    acc[zone] = filtered.filter(t => t.zone === zone);
    return acc;
  }, {});

  async function markCleaned(tableId: string) {
    setUpdating(tableId);
    const res = await fetch(`/api/tables/${tableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'available' }),
    });
    if (res.ok) {
      const data = await res.json() as { table: RestaurantTable };
      setTables(prev => prev.map(t => t.id === tableId ? data.table : t));
      // Refresh summary
      const summaryRes = await fetch('/api/tables');
      if (summaryRes.ok) {
        const d = await summaryRes.json() as { summary: typeof initialSummary };
        setSummary(d.summary);
      }
    }
    setUpdating(null);
  }

  return (
    <div className="space-y-8">
      {/* Occupancy ring + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 card surface-container-lowest p-6 flex flex-col items-center justify-center gap-4">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E8EBED" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="#944A00" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${summary.occupancyRate} ${100 - summary.occupancyRate}`}
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black">{summary.occupancyRate}%</span>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase">إشغال</span>
            </div>
          </div>
          <p className="label-md text-on-surface-variant text-center">
            {summary.occupied + summary.reserved} من أصل {summary.total} طاولة مشغولة
          </p>
        </div>

        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {([
            { label: 'متاحة', count: summary.available, icon: 'check_circle', color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'مشغولة', count: summary.occupied, icon: 'person', color: 'text-primary', bg: 'bg-primary-container/40' },
            { label: 'محجوزة', count: summary.reserved, icon: 'event', color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'تحتاج تنظيف', count: summary.needsCleaning, icon: 'cleaning_services', color: 'text-zinc-500', bg: 'bg-zinc-100' },
          ] as const).map(item => (
            <div key={item.label} className="card surface-container-lowest p-5 flex flex-col gap-3">
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">{item.label}</p>
                <p className="text-2xl font-black">{item.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone filter */}
      <div className="flex gap-2 flex-wrap">
        {zones.map(zone => (
          <button
            key={zone}
            onClick={() => setActiveZone(zone)}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all active:scale-95 ${activeZone === zone ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            {zone === 'all' ? 'الكل' : ZONE_LABELS[zone]}
          </button>
        ))}
      </div>

      {/* Floor plan grid per zone */}
      {(activeZone === 'all' ? (zones.slice(1) as TableZone[]) : [activeZone] as TableZone[]).map(zone => {
        const zoneTables = grouped[zone];
        if (!zoneTables || zoneTables.length === 0) return null;
        return (
          <section key={zone} className="space-y-4">
            <h3 className="title-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">place</span>
              {ZONE_LABELS[zone]}
              <span className="label-md text-on-surface-variant font-normal mr-1">
                ({zoneTables.filter(t => t.status === 'available').length} متاحة من {zoneTables.length})
              </span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {zoneTables.map(table => {
                const cfg = STATUS_CONFIG[table.status];
                return (
                  <div
                    key={table.id}
                    onClick={() => router.push(`/tables/${table.id}` as any)}
                    className={`relative card p-4 cursor-pointer group transition-all hover:scale-105 ring-2 ${cfg.ring} ${cfg.bg}`}
                  >
                    {/* Table shape icon */}
                    <div className="flex flex-col items-center gap-3">
                      <div className={`relative flex items-center justify-center ${table.shape === 'round' ? 'w-14 h-14 rounded-full' : table.shape === 'square' ? 'w-14 h-14 rounded-xl' : 'w-16 h-10 rounded-xl'} bg-white/70 shadow-sm`}>
                        <span className={`material-symbols-outlined text-2xl ${cfg.text}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                          {table.status === 'occupied' || table.status === 'reserved' ? 'table_restaurant' : table.status === 'needs-cleaning' ? 'cleaning_services' : table.status === 'closed' ? 'block' : 'table_bar'}
                        </span>
                        {/* Pulsing dot for occupied */}
                        {table.status === 'occupied' && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary ring-2 ring-white animate-pulse" />
                        )}
                      </div>

                      <div className="text-center">
                        <p className={`font-black text-lg leading-none ${cfg.text}`}>{table.label}</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">{table.seats} مقاعد</p>
                      </div>

                      {table.currentGuestName && (
                        <p className={`text-[10px] font-bold text-center leading-tight ${cfg.text} line-clamp-2`}>
                          {table.currentGuestName}
                        </p>
                      )}

                      {table.estimatedTurnover && table.status !== 'available' && (
                        <p className="text-[10px] text-on-surface-variant flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-xs">schedule</span>
                          {table.estimatedTurnover}
                        </p>
                      )}
                    </div>

                    {/* Quick action: clean */}
                    {table.status === 'needs-cleaning' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); markCleaned(table.id); }}
                        disabled={updating === table.id}
                        className="absolute inset-x-2 bottom-2 py-1.5 rounded-full bg-primary text-on-primary text-[10px] font-black uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-60"
                      >
                        {updating === table.id ? '...' : 'جاهزة ✓'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
