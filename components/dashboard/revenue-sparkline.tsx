'use client';

import { useState, useCallback } from 'react';
import { useRealtime } from '@/hooks/use-realtime';
import type { Order } from '@/lib/types';

interface Props {
  initialRevenue: number;
  initialPaidCount: number;
  initialDailyData: number[]; // 7 data points (last 7 days)
}

function formatAED(n: number) {
  return new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(n);
}

function buildSparklinePath(data: number[], width: number, height: number): string {
  if (data.length < 2) return '';
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  return data
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * (height * 0.8) - height * 0.1;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

const DAY_LABELS = ['إث', 'ثل', 'أر', 'خم', 'جم', 'سب', 'أح'];

export function RevenueSparkline({ initialRevenue, initialPaidCount, initialDailyData }: Props) {
  const [revenue, setRevenue]       = useState(initialRevenue);
  const [paidCount, setPaidCount]   = useState(initialPaidCount);
  const [dailyData, setDailyData]   = useState(initialDailyData);
  const [flash, setFlash]           = useState(false);

  useRealtime({
    'order:updated': useCallback((payload: unknown) => {
      const order = payload as Order;
      if (order.status === 'paid') {
        setRevenue(prev => prev + order.total);
        setPaidCount(prev => prev + 1);
        setDailyData(prev => {
          const next = [...prev];
          next[next.length - 1] = (next[next.length - 1] ?? 0) + order.total;
          return next;
        });
        setFlash(true);
        setTimeout(() => setFlash(false), 1500);
      }
    }, []),
  });

  const W = 200;
  const H = 48;
  const path = buildSparklinePath(dailyData, W, H);

  // Fill path (close under the line)
  const fillPath = path
    ? `${path} L ${W} ${H} L 0 ${H} Z`
    : '';

  const maxIdx = dailyData.indexOf(Math.max(...dailyData));

  return (
    <div
      className="card p-6 space-y-4 transition-all duration-300"
      style={{ background: 'linear-gradient(135deg,rgba(148,74,0,0.06),rgba(230,126,34,0.04))' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-wider">الإيراد الإجمالي</h3>
          <p
            className={`text-3xl font-extrabold text-primary mt-1 tabular-nums transition-all duration-300 ${flash ? 'scale-110' : ''}`}
          >
            {formatAED(revenue)}
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            من <span className="font-bold text-on-surface">{paidCount}</span> طلب مدفوع
          </p>
        </div>
        {flash && (
          <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1 animate-in fade-in">
            <span className="material-symbols-outlined text-sm">add_circle</span>
            دفع جديد
          </span>
        )}
      </div>

      {/* Sparkline SVG */}
      <div className="relative overflow-hidden rounded-xl">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-12" preserveAspectRatio="none">
          {/* Fill */}
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#944A00" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#944A00" stopOpacity="0" />
            </linearGradient>
          </defs>
          {fillPath && <path d={fillPath} fill="url(#sparkGrad)" />}
          {/* Line */}
          {path && (
            <path
              d={path}
              fill="none"
              stroke="#944A00"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {/* Peak dot */}
          {dailyData.length > 1 && (() => {
            const max = Math.max(...dailyData);
            const min = Math.min(...dailyData);
            const range = max - min || 1;
            const step = W / (dailyData.length - 1);
            const px = maxIdx * step;
            const py = H - ((dailyData[maxIdx] - min) / range) * (H * 0.8) - H * 0.1;
            return (
              <circle cx={px} cy={py} r="3.5" fill="#944A00" />
            );
          })()}
        </svg>
      </div>

      {/* Day labels */}
      <div className="flex justify-between">
        {DAY_LABELS.map((d, i) => (
          <span
            key={d}
            className={`text-[10px] font-bold ${i === DAY_LABELS.length - 1 ? 'text-primary' : 'text-on-surface-variant'}`}
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}
