'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Customer } from '@/lib/types';

const tierClass: Record<string, string> = {
  VIP:   'bg-primary-container text-primary',
  Loyal: 'bg-green-100 text-green-800',
  New:   'bg-secondary-container text-secondary',
};
const tierLabel: Record<string, string> = { VIP: 'VIP', Loyal: 'وفاء', New: 'جديد' };

const TIER_FILTERS = ['الكل', 'VIP', 'Loyal', 'New'] as const;
const SORTS = [
  { key: 'name-asc',    label: 'الاسم أ–ي' },
  { key: 'spend-desc',  label: 'الأعلى إنفاقاً' },
  { key: 'visit-desc',  label: 'آخر زيارة' },
] as const;

function formatAED(n: number) {
  return new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(n);
}

interface Props {
  customers: Customer[];
}

export function CustomersList({ customers }: Props) {
  const [search, setSearch] = useState('');
  const [tier,   setTier]   = useState<typeof TIER_FILTERS[number]>('الكل');
  const [sort,   setSort]   = useState<typeof SORTS[number]['key']>('name-asc');

  const filtered = useMemo(() => {
    let list = [...customers];

    // Tier filter
    if (tier !== 'الكل') list = list.filter(c => c.tier === tier);

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sort === 'name-asc')   return a.name.localeCompare(b.name, 'ar');
      if (sort === 'spend-desc') return b.lifetimeSpend - a.lifetimeSpend;
      if (sort === 'visit-desc') return b.lastVisit.localeCompare(a.lastVisit);
      return 0;
    });

    return list;
  }, [customers, search, tier, sort]);

  const vipCount   = customers.filter(c => c.tier === 'VIP').length;
  const loyalCount = customers.filter(c => c.tier === 'Loyal').length;
  const newCount   = customers.filter(c => c.tier === 'New').length;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="card-low p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث بالاسم، الهاتف، البريد..."
            className="input-field ps-10 py-2.5 text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value as typeof sort)}
          className="input-field py-2.5 px-3 text-sm sm:w-44 flex-shrink-0"
        >
          {SORTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>

      {/* Tier filter chips */}
      <div className="flex gap-2 flex-wrap">
        {TIER_FILTERS.map(t => {
          const count = t === 'الكل' ? customers.length
            : t === 'VIP' ? vipCount
            : t === 'Loyal' ? loyalCount
            : newCount;
          return (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                tier === t
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/30'
              }`}
            >
              {t === 'VIP' && <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>}
              {t === 'Loyal' && <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>}
              {t}
              <span className={`text-[10px] ${tier === t ? 'text-white/70' : 'text-on-surface-variant/60'}`}>({count})</span>
            </button>
          );
        })}
        {(search || tier !== 'الكل') && (
          <button
            onClick={() => { setSearch(''); setTier('الكل'); }}
            className="px-3 py-2 rounded-full text-xs font-bold text-error bg-error-container/40 hover:bg-error-container transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">filter_alt_off</span>
            مسح
          </button>
        )}
      </div>

      {/* Results count */}
      {(search || tier !== 'الكل') && (
        <p className="text-xs text-on-surface-variant px-1">
          عرض <span className="font-bold text-on-surface">{filtered.length}</span> من {customers.length} عميل
        </p>
      )}

      {/* Card view — mobile */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-3">person_search</span>
          <p className="text-on-surface-variant">لا يوجد عملاء يطابقون بحثك</p>
        </div>
      ) : (
        <>
          <div className="sm:hidden card overflow-hidden divide-y divide-outline-variant/20">
            {filtered.map(c => (
              <Link
                key={c.id}
                href={`/customers/${c.id}` as any}
                className="flex items-center gap-4 p-4 hover:bg-surface-container-low transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center text-primary font-black text-lg flex-shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-on-surface truncate">{c.name}</p>
                  <p className="text-xs text-on-surface-variant">{c.phone}</p>
                </div>
                <div className="text-left flex-shrink-0 space-y-1">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase block text-center ${tierClass[c.tier]}`}>
                    {tierLabel[c.tier]}
                  </span>
                  <p className="text-xs font-bold text-primary text-center">{formatAED(c.lifetimeSpend)}</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant/50">arrow_back</span>
              </Link>
            ))}
          </div>

          {/* Table view — desktop */}
          <div className="hidden sm:block card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-surface-container-low">
                    {['العميل', 'الفئة', 'إجمالي الإنفاق', 'آخر زيارة', 'الأطباق المفضلة', ''].map(h => (
                      <th key={h} className="px-6 py-4 text-xs text-on-surface-variant font-black uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filtered.map(c => (
                    <tr key={c.id} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-black flex-shrink-0">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-on-surface">{c.name}</p>
                            <p className="text-xs text-on-surface-variant">{c.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${tierClass[c.tier]}`}>
                          {tierLabel[c.tier]}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-bold">{formatAED(c.lifetimeSpend)}</td>
                      <td className="px-6 py-5 text-sm text-on-surface-variant">{c.lastVisit}</td>
                      <td className="px-6 py-5">
                        <div className="flex gap-1.5 flex-wrap">
                          {c.favoriteItems.slice(0, 2).map(item => (
                            <span key={item} className="px-2 py-0.5 rounded bg-surface-container text-[10px] font-medium text-on-surface-variant">
                              {item}
                            </span>
                          ))}
                          {c.favoriteItems.length > 2 && (
                            <span className="text-[10px] text-on-surface-variant">+{c.favoriteItems.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Link
                          href={`/customers/${c.id}` as any}
                          className="text-on-surface-variant hover:text-primary transition-colors group-hover:text-primary"
                        >
                          <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
