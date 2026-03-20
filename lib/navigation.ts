export interface NavItem {
  label: string;
  href: string;
  icon: string;
  module: 'dashboard' | 'reservations' | 'customers' | 'orders' | 'marketing' | 'tables' | 'staff' | 'settings';
}

export const mainNavItems: NavItem[] = [
  { label: 'الرئيسية', href: '/', icon: 'dashboard', module: 'dashboard' },
  { label: 'الحجوزات', href: '/reservations', icon: 'event_upcoming', module: 'reservations' },
  { label: 'العملاء', href: '/customers', icon: 'group', module: 'customers' },
  { label: 'الطاولات', href: '/tables', icon: 'table_restaurant', module: 'tables' },
  { label: 'الطلبات', href: '/orders', icon: 'receipt_long', module: 'orders' },
  { label: 'التسويق', href: '/marketing', icon: 'campaign', module: 'marketing' },
  { label: 'القائمة', href: '/menu', icon: 'restaurant_menu', module: 'staff' },
  { label: 'الموظفون', href: '/staff', icon: 'badge', module: 'staff' },
  { label: 'الإعدادات', href: '/settings', icon: 'settings', module: 'settings' },
];

export const bottomNavItems: NavItem[] = [
  { label: 'Home', href: '/', icon: 'home', module: 'dashboard' },
  { label: 'Reservations', href: '/reservations', icon: 'calendar_today', module: 'reservations' },
  { label: 'Tables', href: '/tables', icon: 'table_bar', module: 'tables' },
  { label: 'Customers', href: '/customers', icon: 'person', module: 'customers' },
];
