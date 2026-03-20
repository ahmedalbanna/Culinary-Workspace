import { listStaff, getStaffSummary } from '@/lib/staff-store';
import Link from 'next/link';

export default function PayrollPage() {
  const staff = listStaff();
  const summary = getStaffSummary();
  const fmt = (n: number) => new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/staff" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <div>
            <h2 className="headline-sm">كشف الرواتب</h2>
            <p className="body-md text-on-surface-variant">مارس 2026 — {staff.filter(s => !s.payroll[0]?.isPaid).length} موظف في انتظار الصرف</p>
          </div>
        </div>
        <button className="btn-primary">
          <span className="material-symbols-outlined">payments</span>
          صرف جميع الرواتب
        </button>
      </header>

      {/* Summary card */}
      <div className="card p-8 grid grid-cols-1 md:grid-cols-3 gap-6" style={{ background: 'linear-gradient(135deg,#944A00,#E67E22)', color: 'white' }}>
        <div className="text-center">
          <p className="text-white/70 text-sm mb-1">إجمالي الرواتب</p>
          <p className="display-md">{fmt(summary.totalPayroll)}</p>
        </div>
        <div className="text-center border-x border-white/20">
          <p className="text-white/70 text-sm mb-1">تم الصرف</p>
          <p className="display-md">{staff.filter(s => s.payroll[0]?.isPaid).length} موظفين</p>
        </div>
        <div className="text-center">
          <p className="text-white/70 text-sm mb-1">في الانتظار</p>
          <p className="display-md">{staff.filter(s => !s.payroll[0]?.isPaid).length} موظفين</p>
        </div>
      </div>

      {/* Payroll rows */}
      <div className="space-y-4">
        {staff.map(member => {
          const payroll = member.payroll[0];
          if (!payroll) return null;
          return (
            <div key={member.id} className="card surface-container-lowest p-6 flex flex-wrap lg:flex-nowrap items-center gap-6 group hover:bg-surface-container-low transition-colors border-r-4 border-primary">
              <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center text-primary font-black text-xl">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold">{member.name}</h4>
                  <p className="text-xs text-on-surface-variant">{member.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                <div className="text-center">
                  <p className="text-[10px] text-on-surface-variant uppercase mb-1">الأساسي</p>
                  <p className="font-bold">{fmt(payroll.baseSalary)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-green-600 uppercase mb-1">إضافي + مكافأة</p>
                  <p className="font-bold text-green-600">+{fmt(payroll.overtime + payroll.bonus)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-error uppercase mb-1">استقطاعات</p>
                  <p className="font-bold text-error">-{fmt(payroll.deductions)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-primary uppercase mb-1">الصافي</p>
                  <p className="font-black text-lg text-primary">{fmt(payroll.net)}</p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <span className={`px-3 py-1.5 rounded-full text-xs font-black ${payroll.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {payroll.isPaid ? 'تم الصرف' : 'في الانتظار'}
                </span>
                <Link href={`/staff/${member.id}/payslip` as any} className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined">receipt</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
