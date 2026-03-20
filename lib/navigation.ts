export interface NavItem {
  label: string;
  href: string;
  icon: string;
  module: 'dashboard' | 'reservations' | 'customers' | 'orders' | 'marketing' | 'tables' | 'staff' | 'settings';
}

export const mainNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: 'dashboard', module: 'dashboard' },
  { label: 'Reservations', href: '/reservations', icon: 'event_upcoming', module: 'reservations' },
  { label: 'Customers', href: '/customers', icon: 'group', module: 'customers' },
  { label: 'Tables', href: '/tables', icon: 'table_restaurant', module: 'tables' },
  { label: 'Orders', href: '/orders', icon: 'receipt_long', module: 'orders' },
  { label: 'Marketing', href: '/marketing', icon: 'campaign', module: 'marketing' },
  { label: 'Staff', href: '/staff', icon: 'badge', module: 'staff' },
];

export const bottomNavItems: NavItem[] = [
  { label: 'Home', href: '/', icon: 'home', module: 'dashboard' },
  { label: 'Reservations', href: '/reservations', icon: 'calendar_today', module: 'reservations' },
  { label: 'Tables', href: '/tables', icon: 'table_bar', module: 'tables' },
  { label: 'Customers', href: '/customers', icon: 'person', module: 'customers' },
];
