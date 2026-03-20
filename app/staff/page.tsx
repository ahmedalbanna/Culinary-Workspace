import { listStaff, getStaffSummary, getPendingLeaveRequests } from '@/lib/staff-store';
import Link from 'next/link';

const STATUS_LABEL: Record<string, string> = { active: 'نشط', 'on-leave': 'إجازة', off: 'خارج الدوام' };
const STATUS_COLOR: Record<string, string> = { active: 'bg-green-100 text-green-700', 'on-leave': 'bg-amber-100 text-amber-700', off: 'bg-zinc-100 text-zinc-500' };

export default function StaffPage() {
  const staff = listStaff();
  const summary = getStaffSummary();
  const pending = getPendingLeaveRequests();

  const fmt = (n: number) => new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="display-md">الموظفون</h2>
          <p className="body-md text-on-surface-variant">إدارة الفريق، الجداول، الرواتب، والمراجعات</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link href="/staff/leave/new" className="btn-secondary flex items-center gap-2">
            <span className="material-symbols-outlined">event_busy</span>
            طلب إجازة
          </Link>
          <Link href="/staff/leave/pending" className="relative btn-secondary flex items-center gap-2">
            <span className="material-symbols-outlined">pending_actions</span>
            الطلبات المعلقة
            {summary.pendingRequests > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error text-white text-[10px] font-black flex items-center justify-center">
                {summary.pendingRequests}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الموظفين', value: summary.total, icon: 'badge', color: 'text-primary', bg: 'bg-primary-container/40' },
          { label: 'نشطون اليوم', value: summary.active, icon: 'how_to_reg', color: 'text-green-700', bg: 'bg-green-100' },
          { label: 'في إجازة', value: summary.onLeave, icon: 'event_busy', color: 'text-amber-700', bg: 'bg-amber-100' },
          { label: 'متوسط الأداء', value: `${summary.avgPerformance}%`, icon: 'leaderboard', color: 'text-blue-700', bg: 'bg-blue-50' },
        ].map(item => (
          <div key={item.label} className="card surface-container-lowest p-5 flex gap-4 items-center">
            <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
              <span className="material-symbols-outlined">{item.icon}</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">{item.label}</p>
              <p className="headline-sm">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick access modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/staff/rota" className="card surface-container-lowest p-6 flex gap-4 items-center group hover:bg-primary-container/10 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">calendar_month</span>
          </div>
          <div className="flex-1">
            <h3 className="title-lg">جدول الدوام</h3>
            <p className="text-sm text-on-surface-variant">عرض وتعديل المناوبات الأسبوعية</p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_left</span>
        </Link>
        <Link href="/staff/payroll" className="card surface-container-lowest p-6 flex gap-4 items-center group hover:bg-primary-container/10 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-700">
            <span className="material-symbols-outlined text-3xl">payments</span>
          </div>
          <div className="flex-1">
            <h3 className="title-lg">الرواتب</h3>
            <p className="text-sm text-on-surface-variant">كشف الرواتب — {fmt(summary.totalPayroll)} شهرياً</p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_left</span>
        </Link>
        <Link href="/staff/attendance" className="card surface-container-lowest p-6 flex gap-4 items-center group hover:bg-primary-container/10 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700">
            <span className="material-symbols-outlined text-3xl">fingerprint</span>
          </div>
          <div className="flex-1">
            <h3 className="title-lg">الحضور والغياب</h3>
            <p className="text-sm text-on-surface-variant">سجل تسجيل الدخول والخروج</p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_left</span>
        </Link>
      </div>

      {/* Staff cards grid */}
      <div>
        <h3 className="headline-sm mb-5">فريق العمل</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {staff.map(member => (
            <Link key={member.id} href={`/staff/${member.id}` as any} className="card surface-container-lowest p-6 flex flex-col gap-5 hover:translate-y-[-4px] transition-transform group">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container text-2xl font-black">
                  {member.name.charAt(0)}
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${STATUS_COLOR[member.status]}`}>
                  {STATUS_LABEL[member.status]}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface">{member.name}</h4>
                <p className="text-xs text-on-surface-variant">{member.role} · {member.department}</p>
              </div>
              {/* Performance bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">الأداء</span>
                  <span className="font-bold text-primary">{member.performanceScore}%</span>
                </div>
                <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${member.performanceScore}%`, background: 'linear-gradient(90deg,#944A00,#E67E22)' }} />
                </div>
              </div>
              {/* Rating stars */}
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`material-symbols-outlined text-sm ${s <= Math.round(member.rating) ? 'text-primary' : 'text-surface-container-highest'}`} style={{ fontVariationSettings: `'FILL' ${s <= Math.round(member.rating) ? 1 : 0}` }}>star</span>
                ))}
                <span className="text-xs text-on-surface-variant mr-1">{member.rating}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pending leave requests */}
      {pending.length > 0 && (
        <div className="card surface-container-lowest p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="title-lg">طلبات الإجازة المعلقة</h3>
            <Link href="/staff/leave/pending" className="text-primary font-bold hover:underline text-sm">عرض الكل</Link>
          </div>
          <div className="space-y-3">
            {pending.map(req => {
              const member = staff.find(s => s.id === req.staffId);
              const typeLabel: Record<string, string> = { annual: 'سنوية', sick: 'مرضية', emergency: 'طارئة', unpaid: 'بدون راتب' };
              return (
                <div key={req.id} className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center font-black">
                      {member?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold">{member?.name}</p>
                      <p className="text-xs text-on-surface-variant">
                        إجازة {typeLabel[req.type]} · {req.days} أيام · {req.from} ← {req.to}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">معلق</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
