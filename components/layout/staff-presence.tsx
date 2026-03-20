'use client';

import { useState } from 'react';
import Link from 'next/link';

// Simulated online staff — in a real app this would come from SSE/WebSocket presence
const ONLINE_STAFF = [
  { id: 'stf_1', name: 'محمد الأنصاري', role: 'مدير', initial: 'م', status: 'online'  as const },
  { id: 'stf_2', name: 'سارة المنصوري', role: 'رئيس نادل', initial: 'س', status: 'online' as const },
  { id: 'stf_3', name: 'كريم حداد',     role: 'طاهٍ',     initial: 'ك', status: 'busy'   as const },
  { id: 'stf_4', name: 'نور الرشيدي',   role: 'نادل',     initial: 'ن', status: 'online' as const },
  { id: 'stf_5', name: 'علي سالم',      role: 'نادل',     initial: 'ع', status: 'away'   as const },
];

const STATUS_DOT: Record<string, string> = {
  online: 'bg-green-500',
  busy:   'bg-error',
  away:   'bg-amber-400',
};
const STATUS_LABEL: Record<string, string> = {
  online: 'متصل', busy: 'مشغول', away: 'غائب',
};

export function StaffPresence() {
  const [expanded, setExpanded] = useState(false);
  const onlineCount = ONLINE_STAFF.filter(s => s.status === 'online').length;

  return (
    <div className="px-2 py-3 border-t border-outline-variant/30">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-surface-container-low transition-colors"
      >
        {/* Avatar stack */}
        <div className="flex -space-x-2 space-x-reverse flex-shrink-0">
          {ONLINE_STAFF.filter(s => s.status === 'online').slice(0, 3).map(s => (
            <div
              key={s.id}
              className="w-6 h-6 rounded-full bg-secondary-container border-2 border-surface flex items-center justify-center text-[10px] font-black text-on-secondary-container"
              title={s.name}
            >
              {s.initial}
            </div>
          ))}
        </div>
        <div className="flex-1 min-w-0 text-right">
          <p className="text-[10px] font-bold text-on-surface-variant leading-tight">
            {onlineCount} متصل الآن
          </p>
        </div>
        <span className={`material-symbols-outlined text-on-surface-variant/60 text-sm transition-transform ${expanded ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {expanded && (
        <div className="mt-2 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
          {ONLINE_STAFF.map(s => (
            <Link
              key={s.id}
              href={`/staff/${s.id}` as any}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-surface-container-low transition-colors"
            >
              <div className="relative flex-shrink-0">
                <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-[11px] font-black text-on-secondary-container">
                  {s.initial}
                </div>
                <span className={`absolute -bottom-0.5 -end-0.5 w-2.5 h-2.5 rounded-full border border-surface ${STATUS_DOT[s.status]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-on-surface truncate">{s.name}</p>
                <p className="text-[9px] text-on-surface-variant">{s.role}</p>
              </div>
              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${
                s.status === 'online' ? 'bg-green-100 text-green-700' :
                s.status === 'busy'   ? 'bg-error-container text-error' :
                'bg-amber-100 text-amber-700'
              }`}>
                {STATUS_LABEL[s.status]}
              </span>
            </Link>
          ))}
          <Link
            href="/staff/preparation"
            className="flex items-center gap-2 px-2 py-2 rounded-xl text-primary hover:bg-primary-container/20 transition-colors mt-1"
          >
            <span className="material-symbols-outlined text-sm">supervisor_account</span>
            <span className="text-[11px] font-bold">إدارة المناوبة</span>
          </Link>
        </div>
      )}
    </div>
  );
}
