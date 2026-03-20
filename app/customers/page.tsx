import { listCustomers } from '@/lib/store';
import Link from 'next/link';
import { CustomersList } from '@/components/customers/customers-list';

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
          <Link href={'/customers/new' as any} className="btn-primary">
            <span className="material-symbols-outlined text-base">person_add</span>
            إضافة عميل
          </Link>
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

      {/* Interactive search + filter + sort + table */}
      <CustomersList customers={customers} />
    </div>
  );
}
