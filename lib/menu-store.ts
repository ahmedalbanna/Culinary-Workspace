import type { MenuItem, MenuCategory, MenuItemStatus, MenuItemUpdate } from '@/lib/types';

interface MenuStore { items: MenuItem[] }

declare global {
  // eslint-disable-next-line no-var
  var __culinaryMenuStore: MenuStore | undefined;
}

function clone<T>(v: T): T { return JSON.parse(JSON.stringify(v)) as T; }

const seedMenu: MenuItem[] = [
  // Mains
  {
    id: 'mnu_1', nameAr: 'ستيك واغيو فاخر', nameEn: 'Premium Wagyu Steak',
    category: 'أطباق رئيسية', description: 'شريحة لحم واغيو طرية مشوية على اللهب مع صلصة الفلفل الأسود والأعشاب البرية.',
    price: 320, emoji: '🥩',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAiWN7cB1F_WXoAIOv1doh7XhzswP0Qpg7cU2sPDjsdeqnIhmMDOIZECOi-imnfuDvMmvH1wr_AmfoMcBGrgiu9bVIwdoQrojEVWqoSGre0y5r1kv3k17dSai4dw6AMqE3CoS7mYm5odtXP8rQCm7x_-jYkS4dBnGVPU2qKP2ji-dqcW8tC8DOgkb6HEta4ZvSLmovHEjVm_pHcOwOZl665lHUgzZM7j_WriGIbJr2qE3qXKlFvJsI56yjAenet0-QZ5CMQAO8QD4',
    prepTime: '25-30 دقيقة', status: 'available', isVipOnly: false, isPopular: true, allergens: [], tags: ['مشوي', 'لحم'],
  },
  {
    id: 'mnu_2', nameAr: 'نودلز حارة بالروبيان', nameEn: 'Spicy Shrimp Noodles',
    category: 'أطباق رئيسية', description: 'نودلز محضرة يدوياً مع الروبيان الكبير، الفلفل الحار، وصلصة الصويا والزنجبيل.',
    price: 85, emoji: '🍜',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCk_dZREK8wFqYdLm8LUqLBbtvx64w--nPahsZwuRqNFJQ5lpyMNgXcTmc1Q5K5UBzFxLWd_wDYYcUZK2tP7fEQylTMm-1c4fVWJLjLqEqFeDZMnmDWunpVZ3PJhBFWg5CC6gehyA-Ujb9D51EcIZmW8aIt1LtW6HHPblY5Uvrj9HBY7AJ1tKJAL5fRbVWtXnIkKOz9xm6cgYqqo5FkWwanSLvpn5Tg84lH0ZpnPC-0C5677B4ZEomHWV2q9qW7VdP9Oe41LSzir3I',
    prepTime: '20 دقيقة', status: 'available', isVipOnly: false, isPopular: true, allergens: ['Shellfish', 'Soy'], tags: ['حار', 'بحري'],
  },
  {
    id: 'mnu_3', nameAr: 'قائمة الشيف التذوقية', nameEn: 'Chef Tasting Menu',
    category: 'أطباق رئيسية', description: '7 أطباق مُختارة بعناية من الشيف التنفيذي تعكس موسم الحصاد الحالي.',
    price: 340, emoji: '🍽️',
    imageUrl: undefined,
    prepTime: '60 دقيقة', status: 'available', isVipOnly: true, isPopular: true, allergens: [], tags: ['شيف', 'موسمي', 'VIP'],
  },
  // Starters
  {
    id: 'mnu_4', nameAr: 'مزة مشكلة', nameEn: 'Mixed Mezze',
    category: 'مقبلات', description: 'تشكيلة من المقبلات الشرقية الأصيلة مع خبز الطابون الطازج.',
    price: 120, emoji: '🫙',
    imageUrl: undefined,
    prepTime: '15 دقيقة', status: 'available', isVipOnly: false, isPopular: false, allergens: ['Gluten'], tags: ['مشاركة', 'تقليدي'],
  },
  {
    id: 'mnu_5', nameAr: 'حمص بالصنوبر', nameEn: 'Hummus with Pine Nuts',
    category: 'مقبلات', description: 'حمص كريمي تقليدي مع زيت الزيتون البكر والصنوبر المحمص والكمون البلدي.',
    price: 35, emoji: '🧆',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtwtSPbZWsl7J38KmNRmGRihXo080jpc-hKD6HW5FfEDrgh6cAFqrO2zdmLQ25QqtkhZLxq1JeIvFOnX5N0Q749goLulb-GgY9b0WIsbBbaN0oltSZnzoIVs52cMR-skL1iKXp4SUHGWLxOLVhmHWzIIRDYEXppbwXKC7v5M5DswFiBl8gL7V5m5KTuJM5yZv5iK9pamVrjXdW9hRc5kyeeYmvuvnkeQHYP0MXokMISJuP_qt_idCEViLFez5cbq_DBnvH_meQuCA',
    prepTime: '10 دقائق', status: 'available', isVipOnly: false, isPopular: false, allergens: ['Sesame'], tags: ['نباتي'],
  },
  // Salads
  {
    id: 'mnu_6', nameAr: 'سلطة الكينوا الملكية', nameEn: 'Royal Quinoa Salad',
    category: 'سلطات', description: 'مزيج من الكينوا العضوية مع الأفوكادو الطازج، الرمان، وجبن الماعز مع صلصة الليمون.',
    price: 65, emoji: '🥗',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6ZW_nN6tRES2ipJgBJstYodeAcS_luWni-2RXHsBpjjO5a0qbI4hSjhQA4e8vggSonkiH11N8gagtjDf2IW0jvipbu6de3-BtoW5DaXQm8G06ELDoodDI29sf6S9da_9fSH4jH0FsH0CSyMXvtEKIj0F1fCo01TH3B28fyDZOYQAUhzii5yGVyBFV2pSsKsNTsJvA-c3ItNUymBVI_Ya-EvosARE2bJp_ofYZ6DwRzcZOI6isCH5bJVSBkJPl9LxtlEKjkhPeL58',
    prepTime: '15 دقيقة', status: 'available', isVipOnly: true, isPopular: true, allergens: ['Dairy'], tags: ['صحي', 'VIP', 'نباتي'],
  },
  // Desserts
  {
    id: 'mnu_7', nameAr: 'لافا كيك الشوكولاتة', nameEn: 'Chocolate Lava Cake',
    category: 'حلويات', description: 'كيك الشوكولاتة البلجيكية الساخنة مع قلب ذائب وكرة من آيس كريم الفانيليا.',
    price: 45, emoji: '🎂',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4pCauhIuBGVIkdGcWJCafVmrRQZaIMitpRAIlbChcfid6X7FTnzeZvn3sM301LZAzkDqXrRXYN9Yr40d2jpfjq5FXVBC37IPyzvM9Hd17CpXzIQx3BbbvRWQK4x-qAJU8-jBx-RlX85UQzgrcOQjFe7ObXwn2dNREQH5ox3Rs_ZIIvotS5nlGCmNn-WcBYh_52SFsDkp_-7dgNEn_Pgdk23EbbGLKYVxMNZH9xo58IdWIDll3MJw15pSxy4q0Zq67ye2Aehvp_8I',
    prepTime: '20 دقيقة', status: 'out-of-stock', isVipOnly: false, isPopular: true, allergens: ['Dairy', 'Gluten', 'Eggs'], tags: ['حلو', 'شوكولاتة'],
  },
  {
    id: 'mnu_8', nameAr: 'كيكة التمر', nameEn: 'Date Cake',
    category: 'حلويات', description: 'كيك التمر الطري المُعطّر بالهيل والزعفران مع كريمة القشطة المخفوقة.',
    price: 65, emoji: '🍰',
    imageUrl: undefined,
    prepTime: '15 دقيقة', status: 'available', isVipOnly: false, isPopular: false, allergens: ['Dairy', 'Gluten', 'Eggs'], tags: ['إماراتي', 'حلو'],
  },
  // Drinks
  {
    id: 'mnu_9', nameAr: 'لاتيه الزعفران', nameEn: 'Saffron Latte',
    category: 'مشروبات', description: 'قهوة بالحليب مع الزعفران الإيراني الأصيل ونكهة الهيل الخليجي.',
    price: 38, emoji: '☕',
    imageUrl: undefined,
    prepTime: '8 دقائق', status: 'available', isVipOnly: false, isPopular: true, allergens: ['Dairy'], tags: ['قهوة', 'خليجي'],
  },
  {
    id: 'mnu_10', nameAr: 'ماتشا الورد', nameEn: 'Rose Matcha',
    category: 'مشروبات', description: 'ماتشا ياباني مع ماء الورد الفاخر والحليب المُزبّد بالتقنية الباردة.',
    price: 42, emoji: '🍵',
    imageUrl: undefined,
    prepTime: '8 دقائق', status: 'available', isVipOnly: false, isPopular: true, allergens: ['Dairy'], tags: ['ماتشا', 'ورد'],
  },
  {
    id: 'mnu_11', nameAr: 'كولد برو', nameEn: 'Cold Brew',
    category: 'مشروبات', description: 'قهوة مُنقّعة على البارد لـ 18 ساعة لطعم سلس وعميق.',
    price: 32, emoji: '🧊',
    imageUrl: undefined,
    prepTime: '3 دقائق', status: 'available', isVipOnly: false, isPopular: false, allergens: [], tags: ['قهوة', 'بارد'],
  },
  // Breakfast
  {
    id: 'mnu_12', nameAr: 'شكشوكة', nameEn: 'Shakshuka',
    category: 'فطور', description: 'بيض مطبوخ على صلصة الطماطم المُتبّلة بالكمون والفلفل والثوم مع خبز عربي.',
    price: 58, emoji: '🍳',
    imageUrl: undefined,
    prepTime: '15 دقيقة', status: 'available', isVipOnly: false, isPopular: true, allergens: ['Eggs', 'Gluten'], tags: ['فطور', 'نباتي'],
  },
  {
    id: 'mnu_13', nameAr: 'توست الأفوكادو', nameEn: 'Avocado Toast',
    category: 'فطور', description: 'خبز محمص مع الأفوكادو المهروس، البيض المُعشّش، وبذور الشيا.',
    price: 68, emoji: '🥑',
    imageUrl: undefined,
    prepTime: '12 دقيقة', status: 'available', isVipOnly: false, isPopular: false, allergens: ['Eggs', 'Gluten'], tags: ['فطور', 'صحي'],
  },
  // Pastries
  {
    id: 'mnu_14', nameAr: 'كرواسان الحلوم', nameEn: 'Halloumi Croissant',
    category: 'خبز وفطائر', description: 'كرواسان طازج محشو بالحلوم المشوي والأعشاب الطازجة.',
    price: 48, emoji: '🥐',
    imageUrl: undefined,
    prepTime: '10 دقائق', status: 'available', isVipOnly: false, isPopular: false, allergens: ['Dairy', 'Gluten'], tags: ['فطائر', 'حلوم'],
  },
];

function initMenuStore(): MenuStore {
  if (!globalThis.__culinaryMenuStore) {
    globalThis.__culinaryMenuStore = { items: clone(seedMenu) };
  }
  return globalThis.__culinaryMenuStore;
}

export function listMenuItems(): MenuItem[] { return clone(initMenuStore().items); }
export function getMenuItem(id: string): MenuItem | undefined { return listMenuItems().find(i => i.id === id); }

export function listCategories(): MenuCategory[] {
  const all = listMenuItems().map(i => i.category);
  return [...new Set(all)] as MenuCategory[];
}

export function addMenuItem(input: Omit<MenuItem, 'id'>): MenuItem {
  const store = initMenuStore();
  const item: MenuItem = { ...input, id: `mnu_${Date.now()}` };
  store.items.push(item);
  return clone(item);
}

export function updateMenuItem(id: string, update: MenuItemUpdate): MenuItem | undefined {
  const store = initMenuStore();
  const item = store.items.find(i => i.id === id);
  if (!item) return undefined;
  Object.assign(item, update);
  return clone(item);
}

export function deleteMenuItem(id: string): boolean {
  const store = initMenuStore();
  const idx = store.items.findIndex(i => i.id === id);
  if (idx === -1) return false;
  store.items.splice(idx, 1);
  return true;
}

export function getMenuSummary() {
  const items = listMenuItems();
  return {
    total: items.length,
    available: items.filter(i => i.status === 'available').length,
    outOfStock: items.filter(i => i.status === 'out-of-stock').length,
    vipOnly: items.filter(i => i.isVipOnly).length,
    popular: items.filter(i => i.isPopular).length,
    categoryCounts: listCategories().map(cat => ({
      category: cat,
      count: items.filter(i => i.category === cat).length,
    })),
  };
}
