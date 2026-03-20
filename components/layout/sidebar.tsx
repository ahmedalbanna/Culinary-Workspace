'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mainNavItems } from '@/lib/navigation';
import { NotificationsPanel } from '@/components/layout/notifications-panel';
import { StaffPresence } from '@/components/layout/staff-presence';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="app-sidebar">
      {/* Brand + notifications */}
      <div className="flex items-center gap-3 px-4 mb-8">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#944A00,#E67E22)' }}>
          <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-on-surface leading-tight">Maître D'</p>
          <p className="text-[10px] text-on-surface-variant">نظام إدارة المطعم</p>
        </div>
        <NotificationsPanel />
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href as any}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Staff presence */}
      <StaffPresence />

      {/* User profile */}
      <div className="pt-3 border-t border-outline-variant">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-black text-sm flex-shrink-0">
            أ
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-on-surface truncate">أحمد خالد</p>
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" title="متصل" />
            </div>
            <p className="text-[10px] text-on-surface-variant truncate">مدير الفرع</p>
          </div>
          <Link href={'/settings' as any} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
