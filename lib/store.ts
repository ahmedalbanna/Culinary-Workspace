import { Customer, DashboardSnapshot, Reservation, ReservationInput, ReservationStatus, ReservationUpdate, RestaurantTable, TableUpdate } from '@/lib/types';

interface CRMStore {
  customers: Customer[];
  reservations: Reservation[];
  tables: RestaurantTable[];
}

declare global {
  // eslint-disable-next-line no-var
  var __culinaryCRMStore: CRMStore | undefined;
}

const seedCustomers: Customer[] = [
  {
    id: 'cust_1',
    name: 'Layla Hassan',
    phone: '+971 50 555 0101',
    email: 'layla@cafeexample.com',
    tier: 'VIP',
    favoriteTable: 'P2',
    favoriteItems: ['Saffron latte', 'Date cake'],
    preferences: [
      { label: 'Seating', detail: 'Prefers patio corner after 7pm' },
      { label: 'Service', detail: 'Sparkling water on arrival' },
    ],
    allergies: ['None'],
    notes: 'Celebrates monthly team dinners here. Enjoys quiet seating for business guests.',
    lifetimeSpend: 4820,
    lastVisit: '2026-03-16',
    orderHistory: [
      { id: 'ord_101', date: '2026-03-16', total: 248, items: [{ name: 'Saffron latte', quantity: 2 }, { name: 'Date cake', quantity: 1 }] },
      { id: 'ord_092', date: '2026-02-28', total: 410, items: [{ name: 'Chef tasting menu', quantity: 2 }] },
    ],
    offers: [
      { id: 'off_1', title: 'VIP chef counter tasting', channel: 'sms', reason: 'High lifetime spend + tasting menu affinity', expiresAt: '2026-03-31' },
    ],
  },
  {
    id: 'cust_2',
    name: 'Omar Nasser',
    phone: '+971 50 555 0102',
    email: 'omar@cafeexample.com',
    tier: 'Loyal',
    favoriteTable: 'W4',
    favoriteItems: ['Cold brew', 'Shakshuka'],
    preferences: [
      { label: 'Dietary', detail: 'Gluten-free bread preferred' },
      { label: 'Pacing', detail: 'Usually in and out within 45 minutes' },
    ],
    allergies: ['Gluten sensitivity'],
    notes: 'Frequent weekday breakfast guest. Responds well to morning promotions.',
    lifetimeSpend: 1735,
    lastVisit: '2026-03-18',
    orderHistory: [
      { id: 'ord_110', date: '2026-03-18', total: 78, items: [{ name: 'Cold brew', quantity: 1 }, { name: 'Shakshuka', quantity: 1 }] },
      { id: 'ord_104', date: '2026-03-10', total: 64, items: [{ name: 'Flat white', quantity: 1 }, { name: 'Avocado toast', quantity: 1 }] },
    ],
    offers: [
      { id: 'off_2', title: 'Weekday breakfast bundle', channel: 'email', reason: 'Strong breakfast repeat behavior', expiresAt: '2026-03-27' },
    ],
  },
  {
    id: 'cust_3',
    name: 'Mina Farouk',
    phone: '+971 50 555 0103',
    email: 'mina@cafeexample.com',
    tier: 'New',
    favoriteItems: ['Rose matcha', 'Halloumi croissant'],
    preferences: [
      { label: 'Occasion', detail: 'Often books for birthday brunches' },
    ],
    allergies: ['Tree nuts'],
    notes: 'New guest with strong brunch spend potential.',
    lifetimeSpend: 420,
    lastVisit: '2026-03-12',
    orderHistory: [
      { id: 'ord_115', date: '2026-03-12', total: 140, items: [{ name: 'Rose matcha', quantity: 2 }, { name: 'Halloumi croissant', quantity: 2 }] },
    ],
    offers: [
      { id: 'off_3', title: 'Birthday brunch add-on dessert', channel: 'server note', reason: 'Birthday / brunch pattern detected', expiresAt: '2026-04-15' },
    ],
  },
];

const seedTables: RestaurantTable[] = [
  // Patio (6 tables)
  { id: 'tbl_P1', label: 'P1', zone: 'Patio', seats: 2, status: 'available', shape: 'round' },
  { id: 'tbl_P2', label: 'P2', zone: 'Patio', seats: 6, status: 'reserved', shape: 'rectangle', currentGuestName: 'Layla Hassan', currentReservationId: 'res_1', estimatedTurnover: '22:00' },
  { id: 'tbl_P3', label: 'P3', zone: 'Patio', seats: 4, status: 'available', shape: 'round' },
  { id: 'tbl_P4', label: 'P4', zone: 'Patio', seats: 2, status: 'needs-cleaning', shape: 'round' },
  { id: 'tbl_P5', label: 'P5', zone: 'Patio', seats: 4, status: 'available', shape: 'square' },
  { id: 'tbl_P6', label: 'P6', zone: 'Patio', seats: 8, status: 'closed', shape: 'rectangle', notes: 'Under maintenance' },

  // Window (5 tables)
  { id: 'tbl_W1', label: 'W1', zone: 'Window', seats: 2, status: 'available', shape: 'round' },
  { id: 'tbl_W2', label: 'W2', zone: 'Window', seats: 2, status: 'occupied', shape: 'round', currentGuestName: 'Ahmed Khalid', seatedAt: '08:00', estimatedTurnover: '09:00' },
  { id: 'tbl_W3', label: 'W3', zone: 'Window', seats: 4, status: 'needs-cleaning', shape: 'square' },
  { id: 'tbl_W4', label: 'W4', zone: 'Window', seats: 2, status: 'occupied', shape: 'round', currentGuestName: 'Omar Nasser', seatedAt: '08:30', estimatedTurnover: '09:15', currentReservationId: 'res_2' },
  { id: 'tbl_W5', label: 'W5', zone: 'Window', seats: 4, status: 'available', shape: 'square' },

  // Main Hall (8 tables)
  { id: 'tbl_M1', label: 'M1', zone: 'Main Hall', seats: 4, status: 'available', shape: 'square' },
  { id: 'tbl_M2', label: 'M2', zone: 'Main Hall', seats: 4, status: 'available', shape: 'square' },
  { id: 'tbl_M3', label: 'M3', zone: 'Main Hall', seats: 6, status: 'occupied', shape: 'rectangle', currentGuestName: 'Family group', seatedAt: '12:00', estimatedTurnover: '13:30' },
  { id: 'tbl_M4', label: 'M4', zone: 'Main Hall', seats: 4, status: 'available', shape: 'square' },
  { id: 'tbl_M5', label: 'M5', zone: 'Main Hall', seats: 8, status: 'reserved', shape: 'rectangle', currentGuestName: 'Corporate booking', currentReservationId: 'res_4', estimatedTurnover: '22:30' },
  { id: 'tbl_M6', label: 'M6', zone: 'Main Hall', seats: 2, status: 'available', shape: 'round' },
  { id: 'tbl_M7', label: 'M7', zone: 'Main Hall', seats: 4, status: 'needs-cleaning', shape: 'square' },
  { id: 'tbl_M8', label: 'M8', zone: 'Main Hall', seats: 4, status: 'occupied', shape: 'square', currentGuestName: 'Mina Farouk', seatedAt: '12:15', estimatedTurnover: '13:45', currentReservationId: 'res_3' },

  // Chef Counter (4 seats)
  { id: 'tbl_C1', label: 'C1', zone: 'Chef Counter', seats: 2, status: 'available', shape: 'square' },
  { id: 'tbl_C2', label: 'C2', zone: 'Chef Counter', seats: 2, status: 'available', shape: 'square' },
  { id: 'tbl_C3', label: 'C3', zone: 'Chef Counter', seats: 2, status: 'occupied', shape: 'square', currentGuestName: 'Chef experience pair', seatedAt: '20:00', estimatedTurnover: '22:00' },
  { id: 'tbl_C4', label: 'C4', zone: 'Chef Counter', seats: 2, status: 'closed', shape: 'square', notes: 'Reserved for event' },
];

const seedReservations: Reservation[] = [
  {
    id: 'res_1',
    customerId: 'cust_1',
    guestName: 'Layla Hassan',
    partySize: 6,
    date: '2026-03-20',
    time: '19:30',
    zone: 'Patio',
    tableLabel: 'P2',
    status: 'confirmed',
    occasion: 'Client dinner',
    notes: 'Needs quiet corner and sparkling water on arrival.',
    source: 'phone',
  },
  {
    id: 'res_2',
    customerId: 'cust_2',
    guestName: 'Omar Nasser',
    partySize: 2,
    date: '2026-03-20',
    time: '08:30',
    zone: 'Window',
    tableLabel: 'W4',
    status: 'completed',
    occasion: 'Breakfast meeting',
    notes: 'Gluten-free bread.',
    source: 'website',
  },
  {
    id: 'res_3',
    customerId: 'cust_3',
    guestName: 'Mina Farouk',
    partySize: 4,
    date: '2026-03-20',
    time: '12:15',
    zone: 'Main Hall',
    tableLabel: 'M8',
    status: 'seated',
    occasion: 'Birthday brunch',
    notes: 'Tree nut allergy noted.',
    source: 'instagram',
  },
  {
    id: 'res_4',
    customerId: 'cust_1',
    guestName: 'Layla Hassan',
    partySize: 2,
    date: '2026-03-20',
    time: '21:00',
    zone: 'Chef Counter',
    tableLabel: 'C1',
    status: 'waitlist',
    occasion: 'After-dinner dessert',
    notes: 'Upgrade to chef counter if available.',
    source: 'walk-in',
  },
];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function initStore(): CRMStore {
  if (!globalThis.__culinaryCRMStore) {
    globalThis.__culinaryCRMStore = {
      customers: clone(seedCustomers),
      reservations: clone(seedReservations),
      tables: clone(seedTables),
    };
  }

  return globalThis.__culinaryCRMStore;
}

function getTodayString() {
  return '2026-03-20';
}

export function listCustomers(): Customer[] {
  return clone(initStore().customers);
}

export function listReservations(): Reservation[] {
  return clone(initStore().reservations).sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
}

export function getCustomer(customerId: string): Customer | undefined {
  return listCustomers().find((customer) => customer.id === customerId);
}

export function getReservation(reservationId: string): Reservation | undefined {
  return listReservations().find((reservation) => reservation.id === reservationId);
}

export function createReservation(input: ReservationInput): Reservation {
  const store = initStore();
  const reservation: Reservation = {
    id: `res_${store.reservations.length + 1}_${Date.now()}`,
    guestName: input.guestName,
    customerId: input.customerId,
    partySize: input.partySize,
    date: input.date,
    time: input.time,
    zone: input.zone,
    tableLabel: input.tableLabel,
    status: input.status,
    occasion: input.occasion,
    notes: input.notes ?? '',
    source: input.source,
  };

  store.reservations.push(reservation);
  return clone(reservation);
}

export function updateReservation(reservationId: string, update: ReservationUpdate): Reservation | undefined {
  const store = initStore();
  const reservation = store.reservations.find((item) => item.id === reservationId);

  if (!reservation) {
    return undefined;
  }

  Object.assign(reservation, update);
  return clone(reservation);
}

export function getDashboardSnapshot(): DashboardSnapshot {
  const customers = listCustomers();
  const reservations = listReservations();
  const today = getTodayString();
  const todaysReservations = reservations.filter((reservation) => reservation.date === today);
  const projectedRevenue = todaysReservations.reduce((sum, reservation) => {
    const customer = customers.find((item) => item.id === reservation.customerId);
    const averageTicket = customer?.orderHistory[0]?.total ?? 95;
    return sum + averageTicket;
  }, 0);
  const vipArrivals = todaysReservations.filter((reservation) => customers.find((customer) => customer.id === reservation.customerId)?.tier === 'VIP').length;
  const offerReadyCount = customers.filter((customer) => customer.offers.length > 0).length;

  return {
    customers,
    reservations: todaysReservations,
    todaysCovers: todaysReservations.reduce((sum, reservation) => sum + reservation.partySize, 0),
    vipArrivals,
    projectedRevenue,
    offerReadyCount,
  };
}

export const reservationStatuses: ReservationStatus[] = ['confirmed', 'seated', 'completed', 'waitlist'];

// ─── Customer helpers ─────────────────────────────────────────────────────────

export interface NewCustomerInput {
  name: string;
  phone: string;
  email: string;
  tier: 'VIP' | 'Loyal' | 'New';
  notes: string;
  birthday?: string;
}

export interface CustomerUpdate {
  name?: string;
  phone?: string;
  email?: string;
  tier?: 'VIP' | 'Loyal' | 'New';
  notes?: string;
  birthday?: string;
  allergies?: string[];
  preferences?: { label: string; detail: string }[];
  favoriteTable?: string;
}

export function updateCustomer(id: string, update: CustomerUpdate): Customer | undefined {
  const store = initStore();
  const customer = store.customers.find(c => c.id === id);
  if (!customer) return undefined;
  Object.assign(customer, update);
  return clone(customer);
}

export function createCustomer(input: NewCustomerInput): Customer {
  const store = initStore();
  const id = `cust_${Date.now()}`;
  const customer: Customer = {
    id,
    name: input.name,
    phone: input.phone,
    email: input.email,
    tier: input.tier,
    favoriteItems: [],
    preferences: [],
    allergies: [],
    notes: input.notes,
    lifetimeSpend: 0,
    lastVisit: new Date().toISOString().slice(0, 10),
    orderHistory: [],
    offers: [],
  };
  store.customers.push(customer);
  return clone(customer);
}

// ─── Table helpers ───────────────────────────────────────────────────────────

export function listTables(): RestaurantTable[] {
  return clone(initStore().tables);
}

export function getTable(tableId: string): RestaurantTable | undefined {
  return listTables().find((t) => t.id === tableId);
}

export function getTableByLabel(label: string): RestaurantTable | undefined {
  return listTables().find((t) => t.label === label);
}

export function updateTable(tableId: string, update: TableUpdate): RestaurantTable | undefined {
  const store = initStore();
  const table = store.tables.find((t) => t.id === tableId);
  if (!table) return undefined;
  Object.assign(table, update);
  return clone(table);
}

export function getTableSummary() {
  const tables = listTables();
  return {
    total: tables.length,
    available: tables.filter((t) => t.status === 'available').length,
    occupied: tables.filter((t) => t.status === 'occupied').length,
    reserved: tables.filter((t) => t.status === 'reserved').length,
    needsCleaning: tables.filter((t) => t.status === 'needs-cleaning').length,
    closed: tables.filter((t) => t.status === 'closed').length,
    occupancyRate: Math.round(
      (tables.filter((t) => t.status === 'occupied' || t.status === 'reserved').length / tables.length) * 100
    ),
  };
}
