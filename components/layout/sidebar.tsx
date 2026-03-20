'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mainNavItems } from '@/lib/navigation';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="app-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #944A00, #E67E22)' }}>
          <span className="material-symbols-outlined text-white text-xl icon-fill">restaurant</span>
        </div>
        <div>
          <h1 className="text-base font-extrabold text-on-surface leading-none">Maître D'</h1>
          <p className="text-[10px] text-on-surface-variant font-medium">نظام إدارة المطعم</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1">
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

      {/* User footer */}
      <div className="mt-auto pt-5 border-t border-outline-variant/40">
        <div className="flex items-center gap-3 px-3">
          <div className="w-9 h-9 rounded-full bg-secondary-container overflow-hidden flex-shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr2xxuABbXcVwXTBSgOycTQZmfEzDj2m5uKJ0jli8vGyAcxjt6HAf6hPnACtCufmWYM3iZyMsmYkL_JPd6Xdp1Y75oEfpMdTU_ZvD5MGfqllxtLlK6MZMqr5zAQMQUZ6TpDNKSzOYV8gswx_j55Gd9cQiQBABito94jViX2naWI1zyzetm6B311JxkpfvVCU4C-nwrf3NPFDrTCxxSC0P0KVbpJ2vz6XeSJyBoce9yWdShwLJBG1AR17CiOoAmlrfT3d3eLM0KEOs"
              alt="المدير"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-on-surface truncate">أحمد خالد</p>
            <p className="text-[10px] text-on-surface-variant truncate">مدير الفرع</p>
          </div>
          <Link href={'/settings' as any} className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container">
            <span className="material-symbols-outlined text-xl">settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
