'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { RestaurantTable, TableStatus, TableZone } from '@/lib/types';
import { useRealtime } from '@/hooks/use-realtime';

const STATUS_CONFIG: Record<TableStatus, { label: string; bg: string; text: string; ring: string; dot: string }> = {
  available:       { label: 'متاحة',          bg: 'bg-green-50',             text: 'text-green-800',              ring: 'ring-green-200',   dot: 'bg-green-500' },
  occupied:        { label: 'مشغولة',          bg: 'bg-primary-container/60', text: 'text-on-primary-container',   ring: 'ring-primary/30',  dot: 'bg-primary' },
  reserved:        { label: 'محجوزة',          bg: 'bg-amber-50',             text: 'text-amber-800',              ring: 'ring-amber-200',   dot: 'bg-amber-500' },
  'needs-cleaning':{ label: 'تحتاج تنظيف',    bg: 'bg-zinc-100',             text: 'text-zinc-600',               ring: 'ring-zinc-300',    dot: 'bg-zinc-400' },
  closed:          { label: 'مغلقة',           bg: 'bg-zinc-50',              text: 'text-zinc-400',               ring: 'ring-zinc-100',    dot: 'bg-zinc-300' },
};

const STATUS_ACTIONS: { value: TableStatus; label: string; icon: string }[] = [
  { value: 'available',        label: 'متاحة',       icon: 'check_circle' },
  { value: 'occupied',         label: 'مشغولة',      icon: 'person' },
  { value: 'reserved',         label: 'محجوزة',      icon: 'event' },
  { value: 'needs-cleaning',   label: 'تنظيف',       icon: 'cleaning_services' },
  { value: 'closed',           label: 'مغلقة',       icon: 'block' },
];

const ZONE_LABELS: Record<TableZone, string> = {
  Patio: 'التراس الخارجي', Window: 'منطقة النوافذ',
  'Main Hall': 'القاعة الرئيسية', 'Chef Counter': 'طاولة الشيف',
};

interface Summary {
  total: number; available: number; occupied: number;
  reserved: number; needsCleaning: number; closed: number; occupancyRate: number;
}

interface Props { tables: RestaurantTable[]; summary: Summary; }

// ─── Seat Modal ──────────────────────────────────────────────────────────────

function SeatModal({ table, onClose, onSave }: {
  table: RestaurantTable;
  onClose: () => void;
  onSave: (guestName: string, partySize: number, turnover: string) => Promise<void>;
}) {
  const [guestName, setGuestName] = useState(table.currentGuestName ?? '');
  const [partySize, setPartySize] = useState(table.seats);
  const [turnover,  setTurnover]  = useState(table.estimatedTurnover ?? '22:00');
  const [saving,    setSaving]    = useState(false);

  async function handleSave() {
    if (!guestName.trim()) return;
    setSaving(true);
    await onSave(guestName, partySize, turnover);
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(25,28,29,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div className="bg-surface-container-lowest rounded-3xl shadow-ambient w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person_add</span>
            إجلاس ضيف — طاولة {table.label}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-on-surface-variant">اسم الضيف *</label>
            <input autoFocus value={guestName} onChange={e => setGuestName(e.target.value)}
              placeholder="مثال: عائلة العلي" className="input-field py-3 ps-4"
              onKeyDown={e => e.key === 'Enter' && handleSave()} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-on-surface-variant">عدد الأفراد</label>
              <div className="flex items-center input-field p-0 overflow-hidden">
                <button onClick={() => setPartySize(p => Math.max(1, p - 1))}
                  className="px-3 py-3 text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="flex-1 text-center font-black">{partySize}</span>
                <button onClick={() => setPartySize(p => Math.min(table.seats, p + 1))}
                  className="px-3 py-3 text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-on-surface-variant">وقت التحرير</label>
              <input type="time" value={turnover} onChange={e => setTurnover(e.target.value)}
                className="input-field py-3 px-4" dir="ltr" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="btn-ghost flex-1 py-3 rounded-full">إلغاء</button>
            <button onClick={handleSave} disabled={saving || !guestName.trim()}
              className="btn-primary flex-1 py-3 rounded-full justify-center">
              {saving
                ? <span className="material-symbols-outlined animate-spin">progress_activity</span>
                : <span className="material-symbols-outlined">person_check</span>
              }
              {saving ? 'جاري الحفظ...' : 'إجلاس الضيف'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Status Context Menu ──────────────────────────────────────────────────────

function StatusMenu({ table, onSelect, onClose, onSeat }: {
  table: RestaurantTable;
  onSelect: (status: TableStatus) => void;
  onClose: () => void;
  onSeat: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="absolute bg-surface-container-lowest rounded-2xl shadow-ambient border border-outline-variant/20 overflow-hidden w-48 animate-in fade-in zoom-in-95 duration-150"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-4 py-2.5 bg-surface-container-low border-b border-outline-variant/20">
          <p className="text-xs font-black text-on-surface-variant uppercase tracking-wider">طاولة {table.label}</p>
        </div>
        {table.status === 'available' && (
          <button onClick={() => { onSeat(); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-container/20 transition-colors text-right">
            <span className="material-symbols-outlined text-primary text-base">person_add</span>
            <span className="text-sm font-bold text-primary">إجلاس ضيف</span>
          </button>
        )}
        {table.status === 'reserved' && (
          <button onClick={() => { onSelect('occupied'); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-container/20 transition-colors text-right">
            <span className="material-symbols-outlined text-primary text-base">person_check</span>
            <span className="text-sm font-bold text-primary">وصل الضيف</span>
          </button>
        )}
        <div className="border-t border-outline-variant/20">
          {STATUS_ACTIONS.filter(s => s.value !== table.status).map(s => (
            <button key={s.value} onClick={() => { onSelect(s.value); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors text-right">
              <span className="material-symbols-outlined text-on-surface-variant text-base">{s.icon}</span>
              <span className="text-sm font-medium">{s.label}</span>
            </button>
          ))}
        </div>
        <div className="border-t border-outline-variant/20">
          <Link href={`/tables/${table.id}` as any} onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors text-right">
            <span className="material-symbols-outlined text-on-surface-variant text-base">open_in_new</span>
            <span className="text-sm font-medium">فتح التفاصيل</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function TableFloorPlan({ tables: initialTables, summary: initialSummary }: Props) {
  const router = useRouter();
  const [tables,      setTables]      = useState(initialTables);
  const [summary,     setSummary]     = useState(initialSummary);
  const [activeZone,  setActiveZone]  = useState<TableZone | 'all'>('all');
  const [updating,    setUpdating]    = useState<string | null>(null);
  const [menuTable,   setMenuTable]   = useState<RestaurantTable | null>(null);
  const [seatTable,   setSeatTable]   = useState<RestaurantTable | null>(null);

  const zones: (TableZone | 'all')[] = ['all', 'Main Hall', 'Patio', 'Window', 'Chef Counter'];
  const filtered = activeZone === 'all' ? tables : tables.filter(t => t.zone === activeZone);

  // Live SSE updates
  useRealtime({
    'table:updated': useCallback((updated: unknown) => {
      const t = updated as RestaurantTable;
      setTables(prev => prev.map(x => x.id === t.id ? t : x));
      setSummary(prev => {
        const counts = { available: 0, occupied: 0, reserved: 0, needsCleaning: 0, closed: 0 };
        // Recompute from full table list
        return { ...prev }; // Will be refreshed by next fetch
      });
    }, []),
  });

  const grouped = zones.slice(1).reduce<Record<string, RestaurantTable[]>>((acc, zone) => {
    acc[zone] = filtered.filter(t => t.zone === zone);
    return acc;
  }, {});

  // ── Patch helper ────────────────────────────────────────────────────────────

  async function patchTable(tableId: string, body: object) {
    setUpdating(tableId);
    const res = await fetch(`/api/tables/${tableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json() as { table: RestaurantTable };
      setTables(prev => prev.map(t => t.id === tableId ? data.table : t));
      // Refresh summary counts
      const sumRes = await fetch('/api/tables');
      if (sumRes.ok) {
        const d = await sumRes.json() as { summary: Summary };
        setSummary(d.summary);
      }
    }
    setUpdating(null);
  }

  // ── Seat guest ─────────────────────────────────────────────────────────────

  async function handleSeat(guestName: string, partySize: number, turnover: string) {
    if (!seatTable) return;
    await patchTable(seatTable.id, {
      status: 'occupied',
      currentGuestName: guestName,
      seatedAt: new Date().toTimeString().slice(0, 5),
      estimatedTurnover: turnover,
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* Occupancy ring + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 card surface-container-lowest p-6 flex flex-col items-center justify-center gap-4">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E8EBED" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#944A00" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${summary.occupancyRate} ${100 - summary.occupancyRate}`}
                style={{ transition: 'stroke-dasharray 0.8s ease' }} />
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
            { label: 'تحتاج تنظيف', count: summary.needsCleaning, icon: 'cleaning_services', color: 'text-zinc-500', bg: 'bg-zinc-100', pulse: summary.needsCleaning > 0 },
          ] as const).map(item => (
            <div key={item.label} className="card surface-container-lowest p-5 flex flex-col gap-3 relative overflow-hidden">
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color} relative`}>
                <span className="material-symbols-outlined">{item.icon}</span>
                {'pulse' in item && item.pulse && item.count > 0 && (
                  <span className="absolute -top-1 -end-1 w-3 h-3 rounded-full bg-error ring-2 ring-white animate-pulse" />
                )}
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
          <button key={zone} onClick={() => setActiveZone(zone)}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all active:scale-95 ${activeZone === zone ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'}`}>
            {zone === 'all' ? 'الكل' : ZONE_LABELS[zone]}
          </button>
        ))}
      </div>

      {/* Floor plan grid per zone */}
      {(activeZone === 'all' ? zones.slice(1) as TableZone[] : [activeZone] as TableZone[]).map(zone => {
        const zoneTables = grouped[zone];
        if (!zoneTables?.length) return null;
        return (
          <section key={zone} className="space-y-4">
            <h3 className="title-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">place</span>
              {ZONE_LABELS[zone]}
              <span className="label-md text-on-surface-variant font-normal ms-1">
                ({zoneTables.filter(t => t.status === 'available').length} متاحة من {zoneTables.length})
              </span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {zoneTables.map(table => {
                const cfg = STATUS_CONFIG[table.status];
                const isUpdating = updating === table.id;
                return (
                  <div key={table.id}
                    onClick={() => setMenuTable(table)}
                    className={`relative card p-4 cursor-pointer group transition-all hover:scale-105 ring-2 ${cfg.ring} ${cfg.bg} ${isUpdating ? 'opacity-60 scale-95' : ''}`}
                  >
                    {isUpdating && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/50 z-10">
                        <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
                      </div>
                    )}

                    {/* Table shape icon */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`relative flex items-center justify-center ${
                        table.shape === 'round' ? 'w-14 h-14 rounded-full' :
                        table.shape === 'square' ? 'w-14 h-14 rounded-xl' :
                        'w-16 h-10 rounded-xl'} bg-white/70 shadow-sm`}>
                        <span className={`material-symbols-outlined text-2xl ${cfg.text}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                          {table.status === 'occupied' || table.status === 'reserved' ? 'table_restaurant' :
                           table.status === 'needs-cleaning' ? 'cleaning_services' :
                           table.status === 'closed' ? 'block' : 'table_bar'}
                        </span>
                        {table.status === 'occupied' && (
                          <span className="absolute -top-1 -end-1 w-3 h-3 rounded-full bg-primary ring-2 ring-white animate-pulse" />
                        )}
                        {table.status === 'reserved' && (
                          <span className="absolute -top-1 -end-1 w-3 h-3 rounded-full bg-amber-400 ring-2 ring-white" />
                        )}
                      </div>

                      <div className="text-center">
                        <p className={`font-black text-lg leading-none ${cfg.text}`}>{table.label}</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">{table.seats} مقاعد</p>
                      </div>

                      {table.currentGuestName && (
                        <p className={`text-[10px] font-bold text-center leading-tight ${cfg.text} line-clamp-1 max-w-full`}>
                          {table.currentGuestName.split(' ')[0]}
                        </p>
                      )}

                      {table.estimatedTurnover && table.status === 'occupied' && (
                        <p className="text-[10px] text-on-surface-variant flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-xs">schedule</span>
                          {table.estimatedTurnover}
                        </p>
                      )}

                      {/* Status chip */}
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} ring-1 ${cfg.ring}`}>
                        {cfg.label}
                      </span>
                    </div>

                    {/* Quick clean button */}
                    {table.status === 'needs-cleaning' && (
                      <button
                        onClick={e => { e.stopPropagation(); patchTable(table.id, { status: 'available' }); }}
                        disabled={isUpdating}
                        className="absolute inset-x-2 bottom-2 py-1 rounded-full bg-primary text-on-primary text-[10px] font-black hover:opacity-90 transition-opacity disabled:opacity-60"
                      >
                        جاهزة ✓
                      </button>
                    )}

                    {/* Available — invite click */}
                    {table.status === 'available' && (
                      <div className="absolute inset-x-2 bottom-2 py-1 rounded-full bg-green-500/20 text-green-700 text-[9px] font-bold text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        اضغط للإجلاس
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Context menu */}
      {menuTable && (
        <StatusMenu
          table={menuTable}
          onClose={() => setMenuTable(null)}
          onSelect={status => patchTable(menuTable.id, { status })}
          onSeat={() => { setSeatTable(menuTable); setMenuTable(null); }}
        />
      )}

      {/* Seat modal */}
      {seatTable && (
        <SeatModal
          table={seatTable}
          onClose={() => setSeatTable(null)}
          onSave={handleSeat}
        />
      )}
    </div>
  );
}
