import { listCustomers } from '@/lib/store';
import Link from 'next/link';

function formatAED(n: number) {
  return new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(n);
}

const tierClass: Record<string, string> = {
  VIP:   'bg-primary-container text-primary',
  Loyal: 'bg-green-100 text-green-800',
  New:   'bg-secondary-container text-secondary',
};

export default function CustomersPage() {
  const customers = listCustomers();

  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      <header className="page-header">
        <div>
          <h2 className="page-title">العملاء</h2>
          <p className="page-subtitle">إدارة ملفات الضيوف وتفضيلاتهم وبرامج الولاء</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button className="btn-secondary">
            <span className="material-symbols-outlined text-base">download</span>
            تصدير
          </button>
          <button className="btn-primary">
            <span className="material-symbols-outlined text-base">person_add</span>
            إضافة عميل
          </button>
        </div>
      </header>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: 'groups', label: 'إجمالي العملاء', value: '1,284', color: 'text-primary', bg: 'bg-primary-container' },
          { icon: 'star', label: 'أعضاء VIP', value: '42', color: 'text-green-700', bg: 'bg-green-100' },
          { icon: 'trending_up', label: 'جدد هذا الشهر', value: '+86', color: 'text-secondary', bg: 'bg-secondary-container' },
        ].map(s => (
          <div key={s.label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <span className={`material-symbols-outlined text-2xl ${s.color}`}>{s.icon}</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium">{s.label}</p>
              <p className="text-2xl font-extrabold text-on-surface">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {/* Table header */}
        <div className="p-4 sm:p-6 border-b border-outline-variant/30 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input type="text" placeholder="ابحث بالاسم، الهاتف، البريد..." className="input-field ps-10 py-2.5 text-sm" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['الكل', 'نشطون', 'VIP'].map((t, i) => (
              <button key={t} className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${i === 0 ? 'bg-surface-container-highest text-on-surface' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive: cards on mobile, table on desktop */}
        <div className="sm:hidden divide-y divide-outline-variant/20">
          {customers.map(c => (
            <Link key={c.id} href={`/customers/${c.id}` as any} className="flex items-center gap-4 p-4 hover:bg-surface-container-low transition-colors">
              <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center text-primary font-black text-lg flex-shrink-0">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-on-surface truncate">{c.name}</p>
                <p className="text-xs text-on-surface-variant">{c.phone}</p>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${tierClass[c.tier]}`}>{c.tier}</span>
              <span className="material-symbols-outlined text-on-surface-variant/50">arrow_back</span>
            </Link>
          ))}
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-surface-container-low">
                {['العميل', 'الفئة', 'إجمالي الإنفاق', 'آخر زيارة', 'الأطباق المفضلة', ''].map(h => (
                  <th key={h} className="px-6 py-4 text-xs text-on-surface-variant font-black uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-black">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{c.name}</p>
                        <p className="text-xs text-on-surface-variant">{c.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${tierClass[c.tier]}`}>{c.tier === 'VIP' ? 'VIP' : c.tier === 'Loyal' ? 'وفاء' : 'جديد'}</span>
                  </td>
                  <td className="px-6 py-5 font-bold">{formatAED(c.lifetimeSpend)}</td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">{c.lastVisit}</td>
                  <td className="px-6 py-5">
                    <div className="flex gap-1.5 flex-wrap">
                      {c.favoriteItems.slice(0, 2).map(item => (
                        <span key={item} className="px-2 py-0.5 rounded bg-surface-container text-[10px] font-medium text-on-surface-variant">{item}</span>
                      ))}
                      {c.favoriteItems.length > 2 && <span className="text-[10px] text-on-surface-variant">+{c.favoriteItems.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Link href={`/customers/${c.id}` as any} className="text-on-surface-variant hover:text-primary transition-colors group-hover:text-primary">
                      <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
