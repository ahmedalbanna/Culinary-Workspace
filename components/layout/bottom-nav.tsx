'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { bottomNavItems } from '@/lib/navigation';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="app-bottom-nav">
      {bottomNavItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href as any}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
