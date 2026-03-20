import { listStaff, getStaffSummary } from '@/lib/staff-store';
import Link from 'next/link';

const ZONE_COLORS: Record<string, string> = {
  'أ': 'border-primary text-primary',
  'ب': 'border-amber-400 text-amber-600',
};

export default function StaffPreparationPage() {
  const staff   = listStaff();
  const summary = getStaffSummary();

  const active  = staff.filter(s => s.status === 'active');
  const onLeave = staff.filter(s => s.status === 'on-leave');

  // Divide staff into roles
  const managers  = active.filter(s => s.role === 'مدير' || s.role === 'رئيس نادل');
  const waiters   = active.filter(s => s.role === 'نادل');
  const kitchen   = active.filter(s => s.role === 'طاهٍ' || s.role === 'طاهٍ مساعد');
  const reception = active.filter(s => s.role === 'استقبال' || s.role === 'صراف' || s.role === 'نظافة');

  const attendanceRate = active.length > 0
    ? Math.round((active.length / (active.length + onLeave.length)) * 100)
    : 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">

      {/* Header */}
      <header className="flex items-center gap-4">
        <Link
          href="/staff"
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors"
        >
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        <div>
          <h2 className="page-title">تجهيز الطاقم</h2>
          <p className="page-subtitle">المناوبة المسائية · {new Date('2026-03-20').toLocaleDateString('ar-AE', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
      </header>

      {/* Shift overview bento card */}
      <section className="card p-6 relative overflow-hidden">
        <div className="absolute top-0 start-0 w-32 h-32 bg-primary-fixed/20 rounded-full -translate-x-8 -translate-y-8 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-6">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-fixed text-on-primary-fixed mb-3">
              الوردية الحالية
            </span>
            <h3 className="text-2xl font-extrabold text-on-surface">المناوبة المسائية</h3>
            <p className="text-on-surface-variant text-sm mt-1">٢٤ أكتوبر ٢٠٢٣ · ١٨:٠٠ – ٠٢:٠٠</p>
          </div>
          <div className="text-center sm:text-left flex-shrink-0">
            <div className="text-4xl font-black text-primary">{active.length}</div>
            <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">موظف نشط</div>
          </div>
        </div>
        <div className="relative z-10 mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'نسبة الحضور', value: `${attendanceRate}%`, icon: 'trending_up', color: 'text-primary' },
            { label: 'المتوقع', value: `${summary.total}`, suffix: 'فرد', icon: 'groups', color: 'text-secondary' },
            { label: 'في إجازة', value: `${onLeave.length}`, icon: 'event_busy', color: 'text-amber-600' },
            { label: 'متوسط الأداء', value: `${summary.avgPerformance}%`, icon: 'leaderboard', color: 'text-green-700' },
          ].map(stat => (
            <div key={stat.label} className="bg-surface-container-low rounded-2xl p-3">
              <span className={`material-symbols-outlined text-sm ${stat.color}`}>{stat.icon}</span>
              <div className="flex items-end gap-1 mt-1">
                <span className="text-lg font-bold">{stat.value}</span>
                {stat.suffix && <span className="text-xs text-on-surface-variant mb-0.5">{stat.suffix}</span>}
              </div>
              <p className="text-[10px] text-on-surface-variant font-bold mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Attendance quick glance */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-wider">حالة الحضور الفورية</h3>
          <Link href="/staff/attendance" className="text-xs font-bold text-primary hover:underline">عرض الكل</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {active.slice(0, 8).map(member => (
            <div key={member.id} className="flex-shrink-0 flex flex-col items-center gap-1.5">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-xl font-black ring-2 ring-primary ring-offset-2">
                  {member.name.charAt(0)}
                </div>
                <span className="absolute bottom-0 end-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <span className="text-[10px] font-medium text-center leading-tight max-w-[56px] truncate">{member.name.split(' ')[0]}</span>
            </div>
          ))}
          {onLeave.slice(0, 2).map(member => (
            <div key={member.id} className="flex-shrink-0 flex flex-col items-center gap-1.5 opacity-50">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant text-xl font-black grayscale">
                  {member.name.charAt(0)}
                </div>
                <span className="absolute bottom-0 end-0 w-4 h-4 bg-error border-2 border-white rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white font-black">!</span>
                </span>
              </div>
              <span className="text-[10px] font-medium text-center text-on-surface-variant leading-tight max-w-[56px] truncate">{member.name.split(' ')[0]}</span>
            </div>
          ))}
          {active.length > 8 && (
            <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center border-2 border-dashed border-outline-variant">
                <span className="text-xs font-bold text-on-surface-variant">+{active.length - 8}</span>
              </div>
              <span className="text-[10px] font-medium text-on-surface-variant">آخرين</span>
            </div>
          )}
        </div>
      </section>

      {/* Role assignment */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-wider">توزيع المهام والفرق</h3>

        {/* Managers */}
        <div className="card p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-container/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">supervisor_account</span>
            </div>
            <div>
              <h4 className="font-bold">مدراء الصالة</h4>
              <p className="text-xs text-on-surface-variant">{managers.length} من أصل {managers.length} معينين</p>
            </div>
          </div>
          <div className="flex -space-x-2 space-x-reverse">
            {managers.slice(0, 3).map(m => (
              <Link
                key={m.id}
                href={`/staff/${m.id}` as any}
                className="w-9 h-9 rounded-full bg-secondary-container border-2 border-white flex items-center justify-center text-sm font-black text-on-secondary-container hover:scale-110 transition-transform"
                title={m.name}
              >
                {m.name.charAt(0)}
              </Link>
            ))}
          </div>
        </div>

        {/* Waiters with zone assignment */}
        <div className="card overflow-hidden">
          <div className="p-4 bg-surface-container-low/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-700">restaurant</span>
              </div>
              <div>
                <h4 className="font-bold">طاقم الخدمة</h4>
                <p className="text-xs text-on-surface-variant">{waiters.length} نادل نشط</p>
              </div>
            </div>
            <Link href="/staff" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-sm">add</span>
            </Link>
          </div>
          <div className="divide-y divide-outline-variant/20">
            {waiters.slice(0, 4).map((waiter, idx) => (
              <div key={waiter.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-sm font-black">
                    {waiter.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{waiter.name}</span>
                </div>
                <div className="flex bg-surface-container rounded-xl p-1 gap-1">
                  {['المنطقة أ', 'المنطقة ب'].map((zone, zi) => (
                    <button
                      key={zone}
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors ${
                        (idx % 2 === 0 ? zi === 0 : zi === 1)
                          ? 'bg-white shadow-sm text-primary'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      {zone}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {waiters.length === 0 && (
              <p className="p-4 text-sm text-on-surface-variant text-center">لا يوجد نادلون في هذه المناوبة</p>
            )}
          </div>
        </div>

        {/* Kitchen */}
        <div className="card p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-700">skillet</span>
            </div>
            <div>
              <h4 className="font-bold">فريق المطبخ</h4>
              <p className="text-xs text-on-surface-variant">{kitchen.length} طاهٍ ومساعد</p>
            </div>
          </div>
          <Link href="/staff" className="px-4 py-2 rounded-2xl bg-secondary-container text-on-secondary-container text-xs font-bold hover:opacity-90 transition-opacity">
            تعديل التوزيع
          </Link>
        </div>

        {/* Reception */}
        {reception.length > 0 && (
          <div className="card p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-700">concierge</span>
              </div>
              <div>
                <h4 className="font-bold">الاستقبال والدعم</h4>
                <p className="text-xs text-on-surface-variant">{reception.length} موظف</p>
              </div>
            </div>
            <div className="flex -space-x-2 space-x-reverse">
              {reception.slice(0, 3).map(m => (
                <div key={m.id} className="w-9 h-9 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-sm font-black text-purple-700">
                  {m.name.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Zone coverage */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-wider">تغطية المناطق</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { zone: 'أ', name: 'الصالة الرئيسية', staff: Math.ceil(waiters.length / 2), color: 'border-primary', dot: 'bg-green-500', label: 'text-primary' },
            { zone: 'ب', name: 'التراس الخارجي',  staff: Math.floor(waiters.length / 2), color: 'border-amber-300', dot: 'bg-amber-400', label: 'text-amber-600' },
          ].map(area => (
            <div key={area.zone} className={`card p-5 border-s-4 ${area.color}`}>
              <span className={`text-[10px] font-black uppercase ${area.label}`}>المنطقة {area.zone}</span>
              <p className="text-sm font-bold mt-1 mb-3">{area.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-on-surface-variant">{area.staff} موظفين</span>
                <span className={`w-2 h-2 rounded-full ${area.dot}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
