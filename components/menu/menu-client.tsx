'use client';

import { useState, useMemo, useRef } from 'react';
import type { MenuItem, MenuCategory, MenuItemStatus } from '@/lib/types';

const ALL_CATEGORIES: MenuCategory[] = ['أطباق رئيسية', 'مقبلات', 'سلطات', 'حلويات', 'مشروبات', 'فطور', 'خبز وفطائر'];

const STATUS_CONFIG: Record<MenuItemStatus, { label: string; badgeClass: string }> = {
  available:     { label: 'متوفر',        badgeClass: 'bg-primary/90 text-white' },
  'out-of-stock': { label: 'نفذت الكمية', badgeClass: 'bg-error text-white' },
  hidden:        { label: 'مخفي',         badgeClass: 'bg-zinc-500 text-white' },
};

const fmt = (n: number) => new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(n);

interface Props {
  items: MenuItem[];
  summary: {
    total: number; available: number; outOfStock: number; vipOnly: number; popular: number;
    categoryCounts: { category: string; count: number }[];
  };
}

const STATUS_CYCLE: MenuItemStatus[] = ['available', 'out-of-stock', 'hidden'];
const STATUS_NEXT: Record<MenuItemStatus, MenuItemStatus> = {
  available: 'out-of-stock', 'out-of-stock': 'hidden', hidden: 'available',
};

export function MenuClient({ items: initialItems, summary }: Props) {
  const [items, setItems] = useState(initialItems);
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuItem>>({});
  const [editSaving, setEditSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  // Inline price edit
  const [priceEdit, setPriceEdit] = useState<string | null>(null);
  const [priceVal, setPriceVal] = useState('');
  // Drag reorder
  const dragId = useRef<string | null>(null);
  const dragOver = useRef<string | null>(null);

  // New dish form state
  const [newDish, setNewDish] = useState({
    nameAr: '', nameEn: '', category: 'أطباق رئيسية' as MenuCategory,
    description: '', price: '', emoji: '🍽️', prepTime: '', isVipOnly: false, isPopular: false,
  });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch = !search || item.nameAr.includes(search) || item.nameEn.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, activeCategory, search]);

  async function patchItem(id: string, update: Partial<MenuItem>) {
    setUpdating(id);
    const res = await fetch(`/api/menu/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(update),
    });
    if (res.ok) {
      const data = await res.json() as { item: MenuItem };
      setItems(prev => prev.map(i => i.id === id ? data.item : i));
      setSavedMsg('تم الحفظ'); setTimeout(() => setSavedMsg(''), 2000);
    }
    setUpdating(null);
    return res.ok;
  }

  function cycleStatus(item: MenuItem) {
    patchItem(item.id, { status: STATUS_NEXT[item.status] });
  }

  function openEdit(item: MenuItem) {
    setEditItem(item);
    setEditForm({ nameAr: item.nameAr, nameEn: item.nameEn, description: item.description, price: item.price, prepTime: item.prepTime, isVipOnly: item.isVipOnly, isPopular: item.isPopular, status: item.status });
  }

  async function saveEdit() {
    if (!editItem) return;
    setEditSaving(true);
    const ok = await patchItem(editItem.id, editForm);
    if (ok) setEditItem(null);
    setEditSaving(false);
  }

  async function savePrice(item: MenuItem) {
    const parsed = parseFloat(priceVal);
    if (!isNaN(parsed) && parsed > 0 && parsed !== item.price) {
      await patchItem(item.id, { price: parsed });
    }
    setPriceEdit(null);
  }

  // Drag-to-reorder (within same category)
  function handleDragStart(id: string) { dragId.current = id; }
  function handleDragOver(e: React.DragEvent, id: string) { e.preventDefault(); dragOver.current = id; }
  function handleDrop() {
    const from = dragId.current; const to = dragOver.current;
    if (!from || !to || from === to) return;
    setItems(prev => {
      const arr = [...prev];
      const fromIdx = arr.findIndex(i => i.id === from);
      const toIdx   = arr.findIndex(i => i.id === to);
      if (fromIdx < 0 || toIdx < 0) return prev;
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      return arr;
    });
    dragId.current = null; dragOver.current = null;
  }

  async function handleAddDish(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newDish,
        price: Number(newDish.price),
        status: 'available',
        allergens: [],
        tags: [],
      }),
    });
    if (res.ok) {
      const data = await res.json() as { item: MenuItem };
      setItems(prev => [...prev, data.item]);
      setShowAddForm(false);
      setNewDish({ nameAr: '', nameEn: '', category: 'أطباق رئيسية', description: '', price: '', emoji: '🍽️', prepTime: '', isVipOnly: false, isPopular: false });
    }
    setSaving(false);
  }

  return (
    <div className="space-y-8">
      {/* Saved flash */}
      {savedMsg && (
        <div className="fixed top-4 end-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-green-100 text-green-700 text-sm font-bold shadow-ambient animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-base">check_circle</span>{savedMsg}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'إجمالي الأطباق', value: summary.total, icon: 'restaurant_menu', color: 'text-primary bg-primary-container/40' },
          { label: 'متوفرة', value: summary.available, icon: 'check_circle', color: 'text-green-700 bg-green-100' },
          { label: 'نفذت', value: summary.outOfStock, icon: 'block', color: 'text-error bg-error-container' },
          { label: 'VIP فقط', value: summary.vipOnly, icon: 'star', color: 'text-amber-700 bg-amber-100' },
          { label: 'الأكثر طلباً', value: summary.popular, icon: 'local_fire_department', color: 'text-orange-700 bg-orange-100' },
        ].map(item => (
          <div key={item.label} className="card surface-container-lowest p-5 flex gap-3 items-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
              <span className="material-symbols-outlined text-sm">{item.icon}</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">{item.label}</p>
              <p className="font-black text-xl">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="البحث عن طبق أو مشروب..."
          className="w-full bg-surface-container-high border-none rounded-2xl pr-12 pl-4 py-3.5 outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 flex-nowrap">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex-shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-all ${activeCategory === 'all' ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'}`}
        >
          الكل ({items.length})
        </button>
        {ALL_CATEGORIES.map(cat => {
          const count = items.filter(i => i.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-all ${activeCategory === cat ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Dish grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => {
          const sc = STATUS_CONFIG[item.status];
          const isOutOfStock = item.status === 'out-of-stock';
          const isHidden     = item.status === 'hidden';
          return (
            <article
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={e => handleDragOver(e, item.id)}
              onDrop={handleDrop}
              className={`card surface-container-lowest overflow-hidden group relative flex flex-col transition-all duration-300 ${isOutOfStock || isHidden ? 'opacity-70' : 'hover:translate-y-[-4px]'} ${dragOver.current === item.id ? 'ring-2 ring-primary scale-[1.02]' : ''}`}
            >
              {/* Image / Emoji hero */}
              <div className={`relative h-48 w-full overflow-hidden flex-shrink-0 ${isOutOfStock ? 'grayscale-[0.6]' : ''}`}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.nameAr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-surface-container flex items-center justify-center text-7xl">{item.emoji}</div>
                )}

                {/* Overlay for out-of-stock */}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-on-surface/20 flex items-center justify-center">
                    <span className="bg-error text-white font-bold px-6 py-2 rounded-xl shadow-lg">نفذت الكمية</span>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 right-3 flex gap-2 flex-wrap justify-end">
                  {item.isVipOnly && (
                    <span className="bg-secondary text-white text-[10px] px-2.5 py-1 rounded-full font-black backdrop-blur-md">VIP</span>
                  )}
                  {item.isPopular && (
                    <span className="bg-primary/90 text-white text-[10px] px-2.5 py-1 rounded-full font-black backdrop-blur-md flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                      رائج
                    </span>
                  )}
                  {!item.isVipOnly && !item.isPopular && (
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-black backdrop-blur-md ${sc.badgeClass}`}>{sc.label}</span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                {/* Drag hint */}
                <div className="absolute top-2 start-2 opacity-0 group-hover:opacity-60 transition-opacity cursor-grab active:cursor-grabbing">
                  <span className="material-symbols-outlined text-white text-lg drop-shadow">drag_indicator</span>
                </div>

                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-bold text-on-surface text-lg leading-tight">{item.nameAr}</h3>
                  {/* Inline price edit */}
                  {priceEdit === item.id ? (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <input
                        autoFocus type="number" min="1" value={priceVal}
                        onChange={e => setPriceVal(e.target.value)}
                        onBlur={() => savePrice(item)}
                        onKeyDown={e => { if (e.key === 'Enter') savePrice(item); if (e.key === 'Escape') setPriceEdit(null); }}
                        className="w-20 text-sm font-black text-primary border border-primary rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                        dir="ltr"
                      />
                      <span className="text-xs text-on-surface-variant">د</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setPriceEdit(item.id); setPriceVal(item.price.toString()); }}
                      className={`font-black text-primary flex-shrink-0 hover:bg-primary-container/30 px-2 py-0.5 rounded-lg transition-colors group/price flex items-center gap-1 ${isOutOfStock ? 'line-through opacity-50' : ''}`}
                      title="اضغط لتعديل السعر"
                    >
                      {fmt(item.price)}
                      <span className="material-symbols-outlined text-xs opacity-0 group-hover/price:opacity-60">edit</span>
                    </button>
                  )}
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed flex-1 mb-5 line-clamp-2">{item.description}</p>

                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                  <div className="flex gap-2">
                    {/* Status cycle button */}
                    <button
                      onClick={() => cycleStatus(item)}
                      disabled={updating === item.id}
                      className={`px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-colors disabled:opacity-60 ${
                        item.status === 'available'     ? 'bg-green-100 text-green-700 hover:bg-error-container hover:text-error' :
                        item.status === 'out-of-stock'  ? 'bg-error-container text-error hover:bg-zinc-100 hover:text-zinc-600' :
                                                          'bg-zinc-100 text-zinc-500 hover:bg-green-100 hover:text-green-700'
                      }`}
                      title={`الحالة التالية: ${STATUS_CONFIG[STATUS_NEXT[item.status]].label}`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {updating === item.id ? 'sync' :
                         item.status === 'available' ? 'check_circle' :
                         item.status === 'out-of-stock' ? 'block' : 'visibility_off'}
                      </span>
                      {STATUS_CONFIG[item.status].label}
                    </button>
                    {/* Edit button */}
                    <button
                      onClick={() => openEdit(item)}
                      className="w-9 h-9 rounded-xl bg-surface-container text-on-surface-variant hover:bg-primary-container/30 hover:text-primary transition-colors flex items-center justify-center"
                      title="تعديل الطبق"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-xl">
                    <span className="material-symbols-outlined text-sm">timer</span>
                    <span>{item.prepTime}</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {/* Add new dish card */}
        <button
          onClick={() => setShowAddForm(true)}
          className="card surface-container-lowest overflow-hidden flex flex-col items-center justify-center p-8 min-h-[400px] border-2 border-dashed border-outline-variant/40 hover:border-primary hover:bg-primary-container/5 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
          </div>
          <h3 className="font-bold text-on-surface text-lg mb-2">إضافة طبق جديد</h3>
          <p className="text-on-surface-variant text-sm text-center">أضف المزيد من الخيارات الشهية لقائمة مطعمك.</p>
        </button>
      </div>

      {/* ── Edit Item Panel ── */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(25,28,29,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setEditItem(null)}
        >
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-ambient overflow-hidden max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
              <h3 className="font-bold text-base flex items-center gap-2">
                <span className="text-2xl">{editItem.emoji}</span>
                تعديل: {editItem.nameAr}
              </h3>
              <button onClick={() => setEditItem(null)} className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant">الاسم بالعربي</label>
                <input value={editForm.nameAr ?? ''} onChange={e => setEditForm(f => ({ ...f, nameAr: e.target.value }))}
                  className="input-field py-3 ps-4" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface-variant">السعر (درهم)</label>
                  <input type="number" min="1" value={editForm.price ?? ''} onChange={e => setEditForm(f => ({ ...f, price: Number(e.target.value) }))}
                    className="input-field py-3 ps-4" dir="ltr" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface-variant">وقت التحضير</label>
                  <input value={editForm.prepTime ?? ''} onChange={e => setEditForm(f => ({ ...f, prepTime: e.target.value }))}
                    placeholder="20 دقيقة" className="input-field py-3 ps-4" />
                </div>
              </div>
              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant">الوصف</label>
                <textarea rows={2} value={editForm.description ?? ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  className="input-field py-3 ps-4 resize-none" />
              </div>
              {/* Status */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant">الحالة</label>
                <div className="flex gap-2">
                  {STATUS_CYCLE.map(s => (
                    <button key={s} type="button" onClick={() => setEditForm(f => ({ ...f, status: s }))}
                      className={`flex-1 py-2 rounded-2xl text-xs font-bold transition-all ${editForm.status === s ? 'ring-2 ring-primary bg-primary-fixed/20 text-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}>
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>
              {/* VIP + Popular */}
              <div className="flex gap-3">
                {[
                  { key: 'isVipOnly', label: 'VIP فقط', icon: 'star' },
                  { key: 'isPopular', label: 'الأكثر طلباً', icon: 'local_fire_department' },
                ].map(toggle => (
                  <button key={toggle.key} type="button"
                    onClick={() => setEditForm(f => ({ ...f, [toggle.key]: !(f as any)[toggle.key] }))}
                    className={`flex-1 flex items-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all ${(editForm as any)[toggle.key] ? 'bg-primary-container text-primary ring-2 ring-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: `'FILL' ${(editForm as any)[toggle.key] ? 1 : 0}` }}>{toggle.icon}</span>
                    {toggle.label}
                  </button>
                ))}
              </div>
              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditItem(null)} className="btn-ghost flex-1 py-3 rounded-full">إلغاء</button>
                <button onClick={saveEdit} disabled={editSaving}
                  className="btn-primary flex-1 py-3 rounded-full justify-center">
                  {editSaving ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <span className="material-symbols-outlined">save</span>}
                  {editSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Dish Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(25,28,29,0.6)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h3 className="headline-sm">إضافة طبق جديد</h3>
              <button onClick={() => setShowAddForm(false)} className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddDish} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="label-md font-bold">الاسم بالعربي</label>
                  <input required value={newDish.nameAr} onChange={e => setNewDish(p => ({ ...p, nameAr: e.target.value }))} placeholder="ستيك واغيو..." className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="label-md font-bold">اسم إنجليزي</label>
                  <input value={newDish.nameEn} onChange={e => setNewDish(p => ({ ...p, nameEn: e.target.value }))} placeholder="Wagyu Steak" className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="label-md font-bold">رمز تعبيري</label>
                  <input value={newDish.emoji} onChange={e => setNewDish(p => ({ ...p, emoji: e.target.value }))} className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary text-center text-2xl" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label-md font-bold">القسم</label>
                <select value={newDish.category} onChange={e => setNewDish(p => ({ ...p, category: e.target.value as MenuCategory }))} className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary">
                  {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="label-md font-bold">الوصف</label>
                <textarea required value={newDish.description} onChange={e => setNewDish(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="وصف الطبق..." className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="label-md font-bold">السعر (درهم)</label>
                  <input required type="number" min={1} value={newDish.price} onChange={e => setNewDish(p => ({ ...p, price: e.target.value }))} placeholder="120" className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="label-md font-bold">وقت التحضير</label>
                  <input value={newDish.prepTime} onChange={e => setNewDish(p => ({ ...p, prepTime: e.target.value }))} placeholder="20 دقيقة" className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors">
                  <input type="checkbox" checked={newDish.isVipOnly} onChange={e => setNewDish(p => ({ ...p, isVipOnly: e.target.checked }))} className="w-5 h-5 accent-primary" />
                  <span className="font-bold text-sm">VIP فقط</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors">
                  <input type="checkbox" checked={newDish.isPopular} onChange={e => setNewDish(p => ({ ...p, isPopular: e.target.checked }))} className="w-5 h-5 accent-primary" />
                  <span className="font-bold text-sm">الأكثر طلباً</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-4 disabled:opacity-60">
                  <span className="material-symbols-outlined">{saving ? 'sync' : 'add_circle'}</span>
                  {saving ? 'جارٍ الحفظ...' : 'إضافة الطبق'}
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary px-8 py-4">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
