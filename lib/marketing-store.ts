import type { MarketingOffer, CustomerSegment, OfferChannel, OfferStatus } from '@/lib/types';

interface MarketingStore {
  offers: MarketingOffer[];
}

declare global {
  // eslint-disable-next-line no-var
  var __culinaryMarketingStore: MarketingStore | undefined;
}

function clone<T>(v: T): T { return JSON.parse(JSON.stringify(v)) as T; }

const seedOffers: MarketingOffer[] = [
  {
    id: 'off_m1',
    title: 'عرض VIP رمضان الخاص',
    description: 'خصم 25% على قائمة الإفطار لعملاء VIP طوال شهر رمضان المبارك. يشمل مشروب ترحيب مجاني.',
    discount: 25,
    channel: 'whatsapp',
    status: 'active',
    segment: 'vip',
    createdAt: '2026-03-01',
    expiresAt: '2026-03-31',
    sentCount: 42,
    openRate: 91,
    redeemCount: 18,
    targetCount: 42,
    tags: ['رمضان', 'VIP', 'إفطار'],
  },
  {
    id: 'off_m2',
    title: 'مكافأة الولاء — قهوة مجانية',
    description: 'قهوة الصباح مجانية لكل عميل وفاء يزور المطعم أيام الأسبوع. لا يحتاج كود.',
    discount: 0,
    channel: 'sms',
    status: 'active',
    segment: 'loyal',
    createdAt: '2026-03-10',
    expiresAt: '2026-04-10',
    sentCount: 156,
    openRate: 78,
    redeemCount: 62,
    targetCount: 156,
    tags: ['ولاء', 'صباح', 'قهوة'],
  },
  {
    id: 'off_m3',
    title: 'ترحيب بالعملاء الجدد',
    description: 'خصم 15% على أول زيارة ثانية خلال 30 يوماً. نريدك أن تصبح من عائلتنا.',
    discount: 15,
    channel: 'email',
    status: 'active',
    segment: 'new',
    createdAt: '2026-03-15',
    expiresAt: '2026-04-15',
    sentCount: 34,
    openRate: 65,
    redeemCount: 9,
    targetCount: 34,
    tags: ['ترحيب', 'جديد', 'عرض أول'],
  },
  {
    id: 'off_m4',
    title: 'نفتقدك! عودة مميزة',
    description: 'مضى أكثر من 60 يوماً على زيارتك الأخيرة. احجز الآن واستمتع بخصم 20% ووجبة مفاجأة.',
    discount: 20,
    channel: 'email',
    status: 'active',
    segment: 'at-risk',
    createdAt: '2026-03-18',
    expiresAt: '2026-04-05',
    sentCount: 28,
    openRate: 54,
    redeemCount: 4,
    targetCount: 28,
    tags: ['استرداد', 'عودة'],
  },
  {
    id: 'off_m5',
    title: 'عرض برانش الجمعة',
    description: 'قائمة برانش خاصة بخصم 30% لحجوزات يومي الجمعة والسبت قبل الساعة 1 ظهراً.',
    discount: 30,
    channel: 'whatsapp',
    status: 'paused',
    segment: 'all',
    createdAt: '2026-02-20',
    expiresAt: '2026-03-20',
    sentCount: 320,
    openRate: 72,
    redeemCount: 95,
    targetCount: 320,
    tags: ['برانش', 'ويكند'],
  },
  {
    id: 'off_m6',
    title: 'عيد الأم — عشاء خاص',
    description: 'احجز طاولة لعيد الأم مع زهور مجانية وكيكة تهنئة.',
    discount: 0,
    channel: 'sms',
    status: 'draft',
    segment: 'all',
    createdAt: '2026-03-20',
    expiresAt: '2026-05-11',
    sentCount: 0,
    openRate: 0,
    redeemCount: 0,
    targetCount: 0,
    tags: ['عيد الأم', 'عائلة'],
  },
];

function initMarketingStore(): MarketingStore {
  if (!globalThis.__culinaryMarketingStore) {
    globalThis.__culinaryMarketingStore = { offers: clone(seedOffers) };
  }
  return globalThis.__culinaryMarketingStore;
}

export function listOffers(): MarketingOffer[] { return clone(initMarketingStore().offers); }
export function getOffer(id: string): MarketingOffer | undefined { return listOffers().find(o => o.id === id); }

export function createOffer(input: Omit<MarketingOffer, 'id' | 'createdAt' | 'sentCount' | 'openRate' | 'redeemCount'>): MarketingOffer {
  const store = initMarketingStore();
  const offer: MarketingOffer = {
    ...input,
    id: `off_m${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    sentCount: 0,
    openRate: 0,
    redeemCount: 0,
  };
  store.offers.push(offer);
  return clone(offer);
}

export function updateOfferStatus(id: string, status: OfferStatus): MarketingOffer | undefined {
  const store = initMarketingStore();
  const offer = store.offers.find(o => o.id === id);
  if (!offer) return undefined;
  offer.status = status;
  return clone(offer);
}

export function getMarketingSummary() {
  const offers = listOffers();
  const active = offers.filter(o => o.status === 'active');
  return {
    totalOffers: offers.length,
    activeOffers: active.length,
    totalSent: offers.reduce((s, o) => s + o.sentCount, 0),
    totalRedeemed: offers.reduce((s, o) => s + o.redeemCount, 0),
    avgOpenRate: active.length ? Math.round(active.reduce((s, o) => s + o.openRate, 0) / active.length) : 0,
    redeemRate: (() => {
      const sent = offers.reduce((s, o) => s + o.sentCount, 0);
      const redeemed = offers.reduce((s, o) => s + o.redeemCount, 0);
      return sent ? Math.round((redeemed / sent) * 100) : 0;
    })(),
  };
}

export const SEGMENTS: { value: CustomerSegment; label: string; description: string; icon: string; color: string; count: number }[] = [
  { value: 'vip',     label: 'VIP',            description: 'عملاء كبار بإنفاق مرتفع',       icon: 'star',            color: 'text-primary bg-primary-container',    count: 42  },
  { value: 'loyal',   label: 'عملاء وفاء',     description: 'زيارات متكررة خلال 90 يوماً',    icon: 'loyalty',         color: 'text-green-700 bg-green-100',           count: 156 },
  { value: 'new',     label: 'عملاء جدد',      description: 'أول زيارة خلال 30 يوماً',        icon: 'person_add',      color: 'text-blue-700 bg-blue-100',             count: 34  },
  { value: 'at-risk', label: 'في خطر الفقدان', description: 'لم يزوروا منذ أكثر من 60 يوماً', icon: 'person_alert',    color: 'text-amber-700 bg-amber-100',           count: 28  },
  { value: 'all',     label: 'الكل',           description: 'جميع العملاء المسجلين',          icon: 'groups',          color: 'text-zinc-700 bg-zinc-100',             count: 1284},
];
