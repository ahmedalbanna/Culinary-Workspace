import Link from 'next/link';
import { listCustomers } from '@/lib/store';
import { createReservationAction } from '@/lib/actions';

const TODAY = '2026-03-20';

export default function NewReservationPage() {
  const customers = listCustomers();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex items-center gap-4">
        <Link
          href="/reservations"
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        <div>
          <h2 className="headline-sm text-on-surface">حجز جديد</h2>
          <p className="body-md text-on-surface-variant">أضف حجزاً جديداً إلى سجل الحجوزات</p>
        </div>
      </header>

      <form action={createReservationAction} className="space-y-6">
        {/* Guest identity */}
        <div className="card surface-container-lowest p-8 space-y-6">
          <h3 className="title-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span>
            بيانات الضيف
          </h3>

          <div className="space-y-2">
            <label className="label-md font-bold">عميل موجود</label>
            <select name="customerId" className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary">
              <option value="">— ضيف جديد / غير محدد —</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.tier})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="label-md font-bold" htmlFor="guestName">اسم الضيف</label>
              <input id="guestName" name="guestName" type="text" required placeholder="الاسم الكامل" className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all" />
            </div>
            <div className="space-y-2">
              <label className="label-md font-bold" htmlFor="phone">رقم الهاتف</label>
              <input id="phone" name="phone" type="tel" placeholder="+971 50 ..." className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all" />
            </div>
          </div>
        </div>

        {/* Reservation details */}
        <div className="card surface-container-lowest p-8 space-y-6">
          <h3 className="title-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">calendar_today</span>
            تفاصيل الحجز
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="label-md font-bold" htmlFor="partySize">عدد الأفراد</label>
              <input id="partySize" name="partySize" type="number" min={1} max={20} defaultValue={2} required className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="label-md font-bold" htmlFor="date">التاريخ</label>
              <input id="date" name="date" type="date" defaultValue={TODAY} required className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="label-md font-bold" htmlFor="time">الوقت</label>
              <input id="time" name="time" type="time" defaultValue="19:00" required className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="label-md font-bold" htmlFor="zone">المنطقة</label>
              <select id="zone" name="zone" className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary">
                <option value="Main Hall">القاعة الرئيسية</option>
                <option value="Patio">التراس الخارجي</option>
                <option value="Window">منطقة النوافذ</option>
                <option value="Chef Counter">طاولة الشيف</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="label-md font-bold" htmlFor="tableLabel">رقم الطاولة</label>
              <input id="tableLabel" name="tableLabel" type="text" defaultValue="M1" placeholder="M1, P2, W4..." required className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="label-md font-bold" htmlFor="source">مصدر الحجز</label>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: 'phone', label: 'هاتف', icon: 'call' },
                { value: 'walk-in', label: 'حضور مباشر', icon: 'directions_walk' },
                { value: 'website', label: 'الموقع', icon: 'language' },
                { value: 'instagram', label: 'انستغرام', icon: 'photo_camera' },
              ].map(s => (
                <label key={s.value} className="flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors has-[:checked]:bg-primary-container has-[:checked]:text-on-primary-container">
                  <input type="radio" name="source" value={s.value} defaultChecked={s.value === 'phone'} className="sr-only" />
                  <span className="material-symbols-outlined text-sm">{s.icon}</span>
                  <span className="font-bold text-sm">{s.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="card surface-container-lowest p-8 space-y-6">
          <h3 className="title-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">notes</span>
            ملاحظات وطلبات
          </h3>

          <div className="space-y-2">
            <label className="label-md font-bold" htmlFor="occasion">المناسبة</label>
            <input id="occasion" name="occasion" type="text" placeholder="عيد ميلاد، عشاء عمل، ذكرى سنوية..." className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div className="space-y-2">
            <label className="label-md font-bold" htmlFor="notes">ملاحظات خاصة</label>
            <textarea id="notes" name="notes" rows={4} placeholder="حساسية، تفضيلات الجلوس، طلبات خاصة..." className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button type="submit" className="btn-primary flex-1 justify-center py-4 text-lg">
            <span className="material-symbols-outlined">check_circle</span>
            تأكيد الحجز
          </button>
          <Link href="/reservations" className="btn-secondary flex items-center justify-center px-8 py-4 text-lg">
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
