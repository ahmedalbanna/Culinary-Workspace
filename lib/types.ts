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

// ─── Menu ────────────────────────────────────────────────────────────────────

export type MenuItemStatus = 'available' | 'out-of-stock' | 'hidden';
export type MenuCategory = 'أطباق رئيسية' | 'مقبلات' | 'حلويات' | 'مشروبات' | 'سلطات' | 'فطور' | 'خبز وفطائر';

export interface MenuItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: MenuCategory;
  description: string;
  price: number;
  emoji: string;
  imageUrl?: string;
  prepTime: string;
  status: MenuItemStatus;
  isVipOnly: boolean;
  isPopular: boolean;
  allergens: string[];
  tags: string[];
}

export interface MenuItemUpdate {
  price?: number;
  status?: MenuItemStatus;
  description?: string;
  prepTime?: string;
  isVipOnly?: boolean;
  isPopular?: boolean;
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export type OrderStatus = 'open' | 'served' | 'paid' | 'cancelled' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'apple-pay' | 'split';

export interface OrderLineItem {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  quantity: number;
  unitPrice: number;
  note?: string;
  emoji: string;
}

export interface Order {
  id: string;
  customerId: string;
  guestName: string;
  tableLabel: string;
  zone: TableZone;
  date: string;
  time: string;
  partySize: number;
  status: OrderStatus;
  items: OrderLineItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod?: PaymentMethod;
  reservationId?: string;
  serverId: string;      // staff id
  serverName: string;
  paidAt?: string;
  notes?: string;
}

// ─── Marketing ───────────────────────────────────────────────────────────────

export type OfferChannel = 'sms' | 'email' | 'whatsapp' | 'server-note';
export type OfferStatus = 'draft' | 'active' | 'paused' | 'expired';
export type CustomerSegment = 'vip' | 'loyal' | 'new' | 'at-risk' | 'all';

export interface OfferSegmentRule {
  segment: CustomerSegment;
  label: string;
  count: number;
}

export interface MarketingOffer {
  id: string;
  title: string;
  description: string;
  discount: number; // percentage
  channel: OfferChannel;
  status: OfferStatus;
  segment: CustomerSegment;
  createdAt: string;
  expiresAt: string;
  sentCount: number;
  openRate: number;   // 0-100
  redeemCount: number;
  targetCount: number;
  tags: string[];
}

// ─── Staff ────────────────────────────────────────────────────────────────────

export type StaffRole = 'مدير' | 'رئيس نادل' | 'نادل' | 'طاهٍ' | 'طاهٍ مساعد' | 'استقبال' | 'صراف' | 'نظافة';
export type StaffStatus = 'active' | 'on-leave' | 'off';

export interface ShiftEntry {
  day: string; // e.g. 'الأحد'
  start: string; // '09:00'
  end: string;   // '17:00'
  type: 'morning' | 'evening' | 'split' | 'off';
}

export interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  lateMinutes: number;
  status: 'present' | 'absent' | 'late' | 'leave';
}

export interface PayrollEntry {
  month: string; // 'مارس 2026'
  baseSalary: number;
  overtime: number;
  deductions: number;
  bonus: number;
  net: number;
  isPaid: boolean;
}

export interface ReviewEntry {
  id: string;
  reviewerName: string;
  date: string;
  rating: number; // 1-5
  comment: string;
  category: 'service' | 'punctuality' | 'teamwork' | 'presentation';
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  type: 'annual' | 'sick' | 'emergency' | 'unpaid';
  from: string;
  to: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  nameEn: string;
  role: StaffRole;
  department: string;
  phone: string;
  email: string;
  status: StaffStatus;
  joinDate: string;
  baseSalary: number;
  avatar?: string;
  rota: ShiftEntry[];
  attendance: AttendanceRecord[];
  payroll: PayrollEntry[];
  reviews: ReviewEntry[];
  leaveBalance: { annual: number; sick: number; used: number };
  performanceScore: number; // 0-100
  rating: number; // 1-5
}
