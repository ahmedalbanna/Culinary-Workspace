import { getCustomer, listReservations } from '@/lib/store';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = getCustomer(params.id);
  if (!customer) notFound();
  
  const reservations = listReservations().filter(r => r.customerId === customer.id);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Link href="/customers" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors">
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        <div>
          <h2 className="headline-sm">ملف العميل: {customer.name}</h2>
          <p className="body-md text-on-surface-variant">{customer.tier} • {customer.email}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card surface-container-lowest p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-surface-container-low rounded-2xl">
              <p className="label-md text-on-surface-variant mb-1">إجمالي الإنفاق</p>
              <p className="headline-sm text-primary">{new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(customer.lifetimeSpend)}</p>
            </div>
            <div className="text-center p-4 bg-surface-container-low rounded-2xl">
              <p className="label-md text-on-surface-variant mb-1">عدد الزيارات</p>
              <p className="headline-sm">{reservations.length}</p>
            </div>
            <div className="text-center p-4 bg-surface-container-low rounded-2xl">
              <p className="label-md text-on-surface-variant mb-1">آخر زيارة</p>
              <p className="headline-sm text-sm">{customer.lastVisit}</p>
            </div>
          </div>

          <div className="card surface-container-lowest p-8 space-y-6">
            <h3 className="title-lg">تاريخ الحجوزات</h3>
            <div className="space-y-4">
              {reservations.map(res => (
                <div key={res.id} className="flex justify-between items-center p-4 border border-outline-variant rounded-2xl">
                  <div>
                    <p className="font-bold">{res.date}</p>
                    <p className="text-xs text-on-surface-variant">{res.time} • طاولة {res.tableLabel} • {res.partySize} أفراد</p>
                  </div>
                  <span className={`status-chip status-${res.status}`}>{res.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card surface-container-lowest p-8 space-y-6">
            <h3 className="title-lg">التفضيلات</h3>
            <div className="space-y-4">
              {customer.preferences.map(p => (
                <div key={p.label}>
                  <p className="label-md font-bold text-primary">{p.label}</p>
                  <p className="body-md">{p.detail}</p>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-outline-variant">
              <p className="label-md font-bold mb-2">الأطباق المفضلة</p>
              <div className="flex flex-wrap gap-2">
                {customer.favoriteItems.map(item => (
                  <span key={item} className="px-3 py-1 bg-surface-container rounded-full text-xs">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
