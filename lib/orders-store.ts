import type { Order, OrderStatus, OrderLineItem } from '@/lib/types';

interface OrdersStore { orders: Order[] }

declare global {
  // eslint-disable-next-line no-var
  var __culinaryOrdersStore: OrdersStore | undefined;
}

function clone<T>(v: T): T { return JSON.parse(JSON.stringify(v)) as T; }

const seedOrders: Order[] = [
  {
    id: 'ord_2001',
    customerId: 'cust_1',
    guestName: 'Layla Hassan',
    tableLabel: 'P2',
    zone: 'Patio',
    date: '2026-03-20',
    time: '20:05',
    partySize: 6,
    status: 'open',
    items: [
      { id: 'li_1', name: 'Saffron Latte', nameAr: 'لاتيه الزعفران',    category: 'مشروبات', quantity: 4, unitPrice: 38, emoji: '☕' },
      { id: 'li_2', name: 'Date Cake',     nameAr: 'كيكة التمر',         category: 'حلويات',  quantity: 2, unitPrice: 65, emoji: '🎂' },
      { id: 'li_3', name: 'Sparkling Water', nameAr: 'ماء غازي',         category: 'مشروبات', quantity: 6, unitPrice: 18, emoji: '💧', note: 'San Pellegrino' },
      { id: 'li_4', name: 'Mixed Mezze',   nameAr: 'مزة مشكلة',          category: 'مقبلات',  quantity: 1, unitPrice: 120, emoji: '🫙' },
    ],
    subtotal: 490, tax: 24.5, discount: 0, total: 514.5,
    serverId: 'stf_2', serverName: 'سارة المنصوري',
    reservationId: 'res_1',
    notes: 'VIP table — sparkling water on arrival',
  },
  {
    id: 'ord_2002',
    customerId: 'cust_2',
    guestName: 'Omar Nasser',
    tableLabel: 'W4',
    zone: 'Window',
    date: '2026-03-20',
    time: '08:55',
    partySize: 2,
    status: 'paid',
    items: [
      { id: 'li_5', name: 'Cold Brew',        nameAr: 'كولد برو',        category: 'مشروبات', quantity: 1, unitPrice: 32, emoji: '🧊' },
      { id: 'li_6', name: 'Shakshuka',        nameAr: 'شكشوكة',          category: 'أطباق رئيسية', quantity: 1, unitPrice: 58, emoji: '🍳', note: 'Gluten-free bread' },
    ],
    subtotal: 90, tax: 4.5, discount: 0, total: 94.5,
    paymentMethod: 'card',
    paidAt: '2026-03-20 09:35',
    serverId: 'stf_2', serverName: 'سارة المنصوري',
    reservationId: 'res_2',
  },
  {
    id: 'ord_2003',
    customerId: 'cust_3',
    guestName: 'Mina Farouk',
    tableLabel: 'M8',
    zone: 'Main Hall',
    date: '2026-03-20',
    time: '12:30',
    partySize: 4,
    status: 'served',
    items: [
      { id: 'li_7', name: 'Rose Matcha',      nameAr: 'ماتشا الورد',     category: 'مشروبات', quantity: 3, unitPrice: 42, emoji: '🍵' },
      { id: 'li_8', name: 'Halloumi Croissant', nameAr: 'كرواسان الحلوم', category: 'خبز وفطائر', quantity: 3, unitPrice: 48, emoji: '🥐' },
      { id: 'li_9', name: 'Birthday Cake',    nameAr: 'كيكة عيد ميلاد',  category: 'حلويات',  quantity: 1, unitPrice: 180, emoji: '🎂', note: 'No nuts — allergy' },
      { id: 'li_10', name: 'Fresh OJ',        nameAr: 'عصير برتقال طازج', category: 'مشروبات', quantity: 2, unitPrice: 28, emoji: '🍊' },
    ],
    subtotal: 488, tax: 24.4, discount: 48.8, total: 463.6,
    serverId: 'stf_2', serverName: 'سارة المنصوري',
    reservationId: 'res_3',
    notes: 'Birthday brunch — complimentary candles',
  },
  {
    id: 'ord_2004',
    customerId: 'cust_1',
    guestName: 'Layla Hassan',
    tableLabel: 'M3',
    zone: 'Main Hall',
    date: '2026-03-16',
    time: '19:15',
    partySize: 2,
    status: 'paid',
    items: [
      { id: 'li_11', name: 'Chef Tasting Menu', nameAr: 'قائمة الشيف التذوقية', category: 'قوائم خاصة', quantity: 2, unitPrice: 340, emoji: '🍽️' },
      { id: 'li_12', name: 'Wine Pairing',      nameAr: 'مقارنة النبيذ',  category: 'مشروبات', quantity: 2, unitPrice: 120, emoji: '🍷' },
    ],
    subtotal: 920, tax: 46, discount: 0, total: 966,
    paymentMethod: 'card',
    paidAt: '2026-03-16 22:10',
    serverId: 'stf_2', serverName: 'سارة المنصوري',
  },
  {
    id: 'ord_2005',
    customerId: 'cust_2',
    guestName: 'Omar Nasser',
    tableLabel: 'W3',
    zone: 'Window',
    date: '2026-03-18',
    time: '07:45',
    partySize: 1,
    status: 'paid',
    items: [
      { id: 'li_13', name: 'Flat White',      nameAr: 'فلات وايت',       category: 'مشروبات', quantity: 1, unitPrice: 28, emoji: '☕' },
      { id: 'li_14', name: 'Avocado Toast',   nameAr: 'توست الأفوكادو',   category: 'فطور',    quantity: 1, unitPrice: 68, emoji: '🥑', note: 'Gluten-free' },
    ],
    subtotal: 96, tax: 4.8, discount: 0, total: 100.8,
    paymentMethod: 'apple-pay',
    paidAt: '2026-03-18 08:20',
    serverId: 'stf_4', serverName: 'نور الرشيدي',
  },
];

function initOrdersStore(): OrdersStore {
  if (!globalThis.__culinaryOrdersStore) {
    globalThis.__culinaryOrdersStore = { orders: clone(seedOrders) };
  }
  return globalThis.__culinaryOrdersStore;
}

export function listOrders(): Order[] {
  return clone(initOrdersStore().orders).sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
}

export function getOrder(id: string): Order | undefined {
  return listOrders().find(o => o.id === id);
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return listOrders().filter(o => o.customerId === customerId);
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
  const store = initOrdersStore();
  const order = store.orders.find(o => o.id === id);
  if (!order) return undefined;
  order.status = status;
  if (status === 'paid') order.paidAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
  return clone(order);
}

export function getOrdersSummary() {
  const orders = listOrders();
  const today = '2026-03-20';
  const todayOrders = orders.filter(o => o.date === today);
  return {
    totalOrders: orders.length,
    todayOrders: todayOrders.length,
    openOrders: orders.filter(o => o.status === 'open').length,
    todayRevenue: todayOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
    totalRevenue: orders.filter(o => o.status === 'paid').reduce((s, o) => s + o.total, 0),
    avgOrderValue: orders.length ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length) : 0,
  };
}

export function updateOrderItems(
  id: string,
  items: OrderLineItem[]
): Order | undefined {
  const store = initOrdersStore();
  const order = store.orders.find(o => o.id === id);
  if (!order) return undefined;
  order.items = items;
  // Recalculate totals
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const tax      = Math.round(subtotal * 0.05 * 100) / 100;
  order.subtotal = Math.round(subtotal * 100) / 100;
  order.tax      = tax;
  order.total    = Math.round((subtotal + tax - order.discount) * 100) / 100;
  return clone(order);
}

export function addOrderItem(id: string, item: Omit<OrderLineItem, 'id'>): Order | undefined {
  const store = initOrdersStore();
  const order = store.orders.find(o => o.id === id);
  if (!order) return undefined;
  // Merge with existing if same item name
  const existing = order.items.find(i => i.name === item.name);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    order.items.push({ ...item, id: `li_${Date.now()}` });
  }
  const subtotal = order.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const tax      = Math.round(subtotal * 0.05 * 100) / 100;
  order.subtotal = Math.round(subtotal * 100) / 100;
  order.tax      = tax;
  order.total    = Math.round((subtotal + tax - order.discount) * 100) / 100;
  return clone(order);
}

export function getTopItems() {
  const orders = listOrders();
  const counts: Record<string, { name: string; nameAr: string; emoji: string; count: number; revenue: number }> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!counts[item.name]) counts[item.name] = { name: item.name, nameAr: item.nameAr, emoji: item.emoji, count: 0, revenue: 0 };
      counts[item.name].count += item.quantity;
      counts[item.name].revenue += item.quantity * item.unitPrice;
    });
  });
  return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
}
