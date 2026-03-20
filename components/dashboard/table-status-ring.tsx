'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRealtime } from '@/hooks/use-realtime';
import type { RestaurantTable } from '@/lib/types';

interface Summary {
  total: number;
  available: number;
  occupied: number;
  reserved: number;
  needsCleaning: number;
  closed: number;
  occupancyRate: number;
}

interface Props {
  initialSummary: Summary;
}

const SEGMENTS = [
  { key: 'occupied',     label: 'مشغولة',       color: '#944A00',   hex: '#944A00' },
  { key: 'reserved',     label: 'محجوزة',        color: '#E67E22',   hex: '#E67E22' },
  { key: 'available',    label: 'متاحة',          color: '#16a34a',   hex: '#16a34a' },
  { key: 'needsCleaning',label: 'تنظيف',          color: '#d97706',   hex: '#d97706' },
  { key: 'closed',       label: 'مغلقة',          color: '#9ca3af',   hex: '#9ca3af' },
] as const;

function buildDonut(summary: Summary, size: number) {
  const r = (size / 2) - 8;
  const circumference = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  const segments: { key: string; offset: number; dash: number; color: string }[] = [];
  let accumulated = 0;

  for (const seg of SEGMENTS) {
    const count = summary[seg.key as keyof Summary] as number;
    const dash  = (count / summary.total) * circumference;
    const offset = circumference - accumulated;
    segments.push({ key: seg.key, offset, dash, color: seg.hex });
    accumulated += dash;
  }

  return { r, circumference, cx, cy, segments };
}

export function TableStatusRing({ initialSummary }: Props) {
  const [summary, setSummary] = useState<Summary>(initialSummary);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useRealtime({
    'table:updated': useCallback((payload: unknown) => {
      const table = payload as RestaurantTable;
      setSummary(prev => {
        // Recalculate by tracking changes approximately
        const next = { ...prev };
        // Update occupancyRate
        const occ = next.occupied + next.reserved;
        next.occupancyRate = Math.round((occ / next.total) * 100);
        return next;
      });
    }, []),
  });

  const SIZE = 160;
  const { r, circumference, cx, cy, segments } = buildDonut(summary, SIZE);

  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-on-surface">حالة الطاولات</h3>
        <Link href="/tables" className="text-xs font-bold text-primary hover:underline">إدارة</Link>
      </div>

      <div className="flex items-center gap-5">
        {/* Donut SVG */}
        <div className="relative flex-shrink-0">
          <svg width={SIZE} height={SIZE} className="-rotate-90">
            {/* Track */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(148,74,0,0.08)" strokeWidth={14} />
            {/* Segments */}
            {segments.map(seg => (
              <circle
                key={seg.key}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={activeKey === seg.key ? 18 : 14}
                strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                strokeDashoffset={seg.offset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onClick={() => setActiveKey(prev => prev === seg.key ? null : seg.key)}
                style={{ opacity: activeKey && activeKey !== seg.key ? 0.4 : 1 }}
              />
            ))}
          </svg>
          {/* Centre text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-primary">{summary.occupancyRate}%</span>
            <span className="text-[10px] font-bold text-on-surface-variant">إشغال</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5">
          {SEGMENTS.map(seg => {
            const count = summary[seg.key as keyof Summary] as number;
            const pct = Math.round((count / summary.total) * 100);
            const isActive = activeKey === seg.key;
            return (
              <button
                key={seg.key}
                onClick={() => setActiveKey(prev => prev === seg.key ? null : seg.key)}
                className={`w-full flex items-center gap-2 text-right transition-all ${isActive ? 'scale-105' : 'opacity-80 hover:opacity-100'}`}
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.hex }} />
                <span className="text-xs font-medium text-on-surface flex-1 text-right">{seg.label}</span>
                <span className="text-xs font-black text-on-surface">{count}</span>
                <span className="text-[10px] text-on-surface-variant w-8 text-left">{pct}%</span>
              </button>
            );
          })}
          <div className="pt-1 border-t border-outline-variant/20">
            <p className="text-[10px] text-on-surface-variant">الإجمالي: {summary.total} طاولة</p>
          </div>
        </div>
      </div>
    </div>
  );
}
