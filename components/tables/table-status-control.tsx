'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { RestaurantTable, TableStatus } from '@/lib/types';

const ALL_STATUSES: { value: TableStatus; label: string; icon: string }[] = [
  { value: 'available', label: 'متاحة', icon: 'check_circle' },
  { value: 'occupied', label: 'مشغولة', icon: 'person' },
  { value: 'reserved', label: 'محجوزة', icon: 'event' },
  { value: 'needs-cleaning', label: 'تحتاج تنظيف', icon: 'cleaning_services' },
  { value: 'closed', label: 'مغلقة', icon: 'block' },
];

export function TableStatusControl({ table }: { table: RestaurantTable }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(table.notes ?? '');

  async function setStatus(status: TableStatus) {
    setLoading(true);
    await fetch(`/api/tables/${table.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    setLoading(false);
    router.refresh();
  }

  async function saveNotes() {
    setLoading(true);
    await fetch(`/api/tables/${table.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="card surface-container-lowest p-6 space-y-4">
        <h3 className="title-lg">تغيير الحالة</h3>
        <div className="grid grid-cols-1 gap-3">
          {ALL_STATUSES.map(s => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value)}
              disabled={loading || table.status === s.value}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all active:scale-98 ${
                table.status === s.value
                  ? 'ring-2 ring-primary bg-primary-container/20 font-black'
                  : 'bg-surface-container-low hover:bg-surface-container-high'
              } disabled:opacity-60`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">{s.icon}</span>
                <span className="font-bold">{s.label}</span>
              </div>
              {table.status === s.value && (
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="card surface-container-lowest p-6 space-y-4">
        <h3 className="title-lg">ملاحظات الطاولة</h3>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="ملاحظات خاصة بالطاولة..."
          className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary resize-none"
        />
        <button
          onClick={saveNotes}
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading ? 'جارٍ الحفظ...' : 'حفظ الملاحظات'}
        </button>
      </div>
    </div>
  );
}
