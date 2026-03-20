import { listStaff } from '@/lib/staff-store';
import Link from 'next/link';

export default function NewLeaveRequestPage() {
  const staff = listStaff();

  return (
    <div className="max-w-lg mx-auto space-y-8 pb-12">
      <header className="flex items-center gap-4">
        <Link href="/staff" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors">
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        <div>
          <h2 className="headline-sm">طلب إجازة جديد</h2>
          <p className="body-md text-on-surface-variant">تقديم طلب إجازة للمراجعة والاعتماد</p>
        </div>
      </header>

      <form className="space-y-6">
        <div className="card surface-container-lowest p-8 space-y-6">
          <div className="space-y-2">
            <label className="label-md font-bold">الموظف</label>
            <select name="staffId" className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary">
              {staff.map(s => <option key={s.id} value={s.id}>{s.name} — {s.role}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="label-md font-bold">نوع الإجازة</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'annual', label: 'سنوية', icon: 'beach_access' },
                { value: 'sick', label: 'مرضية', icon: 'medical_services' },
                { value: 'emergency', label: 'طارئة', icon: 'emergency' },
                { value: 'unpaid', label: 'بدون راتب', icon: 'money_off' },
              ].map(type => (
                <label key={type.value} className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-high hover:bg-primary-container/20 cursor-pointer has-[:checked]:bg-primary-container has-[:checked]:ring-2 has-[:checked]:ring-primary transition-all">
                  <input type="radio" name="type" value={type.value} className="sr-only" defaultChecked={type.value === 'annual'} />
                  <span className="material-symbols-outlined text-primary">{type.icon}</span>
                  <span className="font-bold">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="label-md font-bold">من</label>
              <input type="date" name="from" className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="label-md font-bold">إلى</label>
              <input type="date" name="to" className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="label-md font-bold">سبب الإجازة</label>
            <textarea name="reason" rows={4} placeholder="اشرح سبب طلب الإجازة..." className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="btn-primary flex-1 justify-center py-4">
            <span className="material-symbols-outlined">send</span>
            إرسال الطلب
          </button>
          <Link href="/staff" className="btn-secondary flex items-center justify-center px-8 py-4">إلغاء</Link>
        </div>
      </form>
    </div>
  );
}
