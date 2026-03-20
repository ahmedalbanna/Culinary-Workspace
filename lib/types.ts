export type ReservationStatus = 'confirmed' | 'seated' | 'completed' | 'waitlist';

export type TableZone = 'Patio' | 'Window' | 'Main Hall' | 'Chef Counter';

export interface CustomerPreference {
  label: string;
  detail: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
}

export interface OrderHistoryEntry {
  id: string;
  date: string;
  total: number;
  items: OrderItem[];
}

export interface PersonalizedOffer {
  id: string;
  title: string;
  channel: 'sms' | 'email' | 'server note';
  reason: string;
  expiresAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: 'VIP' | 'Loyal' | 'New';
  favoriteTable?: string;
  favoriteItems: string[];
  preferences: CustomerPreference[];
  allergies: string[];
  notes: string;
  lifetimeSpend: number;
  lastVisit: string;
  orderHistory: OrderHistoryEntry[];
  offers: PersonalizedOffer[];
}

export interface Reservation {
  id: string;
  customerId: string;
  guestName: string;
  partySize: number;
  date: string;
  time: string;
  zone: TableZone;
  tableLabel: string;
  status: ReservationStatus;
  occasion?: string;
  notes: string;
  source: 'phone' | 'walk-in' | 'instagram' | 'website';
}

export interface DashboardSnapshot {
  reservations: Reservation[];
  customers: Customer[];
  todaysCovers: number;
  vipArrivals: number;
  projectedRevenue: number;
  offerReadyCount: number;
}

export interface ReservationInput {
  customerId: string;
  guestName: string;
  partySize: number;
  date: string;
  time: string;
  zone: TableZone;
  tableLabel: string;
  status: ReservationStatus;
  occasion?: string;
  notes?: string;
  source: 'phone' | 'walk-in' | 'instagram' | 'website';
}

export interface ReservationUpdate {
  status?: ReservationStatus;
  tableLabel?: string;
  zone?: TableZone;
  notes?: string;
  occasion?: string;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'needs-cleaning' | 'closed';

export interface RestaurantTable {
  id: string;
  label: string;
  zone: TableZone;
  seats: number;
  status: TableStatus;
  shape: 'round' | 'square' | 'rectangle';
  currentGuestName?: string;
  currentReservationId?: string;
  seatedAt?: string;
  estimatedTurnover?: string;
  notes?: string;
}

export interface TableUpdate {
  status?: TableStatus;
  currentGuestName?: string;
  currentReservationId?: string;
  seatedAt?: string;
  estimatedTurnover?: string;
  notes?: string;
}
