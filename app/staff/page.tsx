import Link from 'next/link';

const staff = [
  { id: 'st_1', name: 'سارة المنصور', role: 'مديرة قاعة', shift: 'مسائي', status: 'present', rating: 4.9, phone: '+971 50 111 2233', avatar: 'S' },
  { id: 'st_2', name: 'خالد العتيبي', role: 'نادل', shift: 'مسائي', status: 'present', rating: 4.7, phone: '+971 50 444 5566', avatar: 'خ' },
  { id: 'st_3', name: 'نورة الزهراني', role: 'مضيفة', shift: 'صباحي', status: 'off', rating: 4.8, phone: '+971 50 777 8899', avatar: 'ن' },
  { id: 'st_4', name: 'فيصل الغامدي', role: 'طاهٍ', shift: 'مسائي', status: 'present', rating: 4.6, phone: '+971 50 222 3344', avatar: 'ف' },
  { id: 'st_5', name: 'ريم الدوسري', role: 'كاشير', shift: 'صباحي', status: 'leave', rating: 4.5, phone: '+971 50 555 6677', avatar: 'ر' },
];

const statusChip: Record<string, { label: string; cls: string }> = {
  present: { label: 'حاضر', cls: 'bg-green-100 text-green-800' },
  off:     { label: 'إجازة يومية', cls: 'bg-surface-container text-on-surface-variant' },
  leave:   { label: 'إجازة رسمية', cls: 'bg-error-container text-error' },
};

export default function StaffPage() {
  const presentCount = staff.filter(s => s.status === 'present').length;
  const onLeaveCount = staff.filter(s => s.status !== 'present').length;

  return (
    <div className="max-w-screen-xl mx-auto space-y-8">

      {/* Header */}
      <header className="page-header">
        <div>
          <h2 className="page-title">الموظفون</h2>
          <p className="page-subtitle">إدارة الجداول الزمنية والحضور والأداء</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button className="btn-secondary">
            <span className="material-symbols-outlined text-base">calendar_month</span>
            جدول الدوام
          </button>
          <button className="btn-primary">
            <span className="material-symbols-outlined text-base">person_add</span>
            إضافة موظف
          </button>
        </div>
      </header>

      {/* KPI strip */}
      <div className="metrics-grid">
        {[
          { label: 'إجمالي الموظفين', value: staff.length, icon: 'badge', color: 'text-primary' },
          { label: 'حاضرون الآن', value: presentCount, icon: 'how_to_reg', color: 'text-green-700' },
          { label: 'في إجازة', value: onLeaveCount, icon: 'event_busy', color: 'text-error' },
          { label: 'متوسط التقييم', value: (staff.reduce((s, e) => s + e.rating, 0) / staff.length).toFixed(1), icon: 'star', color: 'text-yellow-600' },
        ].map(m => (
          <div key={m.label} className="metric-card">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{m.label}</span>
              <span className={`material-symbols-outlined text-xl ${m.color}`}>{m.icon}</span>
            </div>
            <p className="text-3xl font-extrabold text-on-surface tracking-tight">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Staff cards — 2/3 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <h3 className="text-lg font-extrabold">فريق العمل اليوم</h3>
            <div className="flex gap-2">
              {['الكل', 'حاضر', 'إجازة'].map((t, i) => (
                <button key={t} className={`px-4 py-1.5 rounded-full text-xs font-bold ${i === 0 ? 'bg-primary text-white' : 'bg-surface-container-highest text-on-surface-variant'}`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {staff.map(member => (
              <div key={member.id} className="card p-5 flex items-center gap-4 hover:bg-surface-container-low transition-colors group">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-black text-lg flex-shrink-0">
                  {member.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-extrabold text-on-surface">{member.name}</p>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${statusChip[member.status].cls}`}>
                      {statusChip[member.status].label}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">{member.role} • دوام {member.shift}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="material-symbols-outlined text-yellow-500 text-base icon-fill">star</span>
                  <span className="font-bold text-sm">{member.rating}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <a href={`tel:${member.phone}`} className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary-container transition-colors">
                    <span className="material-symbols-outlined text-base text-on-surface-variant">call</span>
                  </a>
                  <button className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-base text-on-surface-variant">more_vert</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick modules */}
          {[
            { title: 'جدول الرواتب', subtitle: 'كشف الرواتب لمارس 2026', icon: 'payments', href: '/staff/payroll', color: 'bg-green-100 text-green-700' },
            { title: 'الإجازات المعلقة', subtitle: '2 طلبات تنتظر الموافقة', icon: 'pending_actions', href: '/staff/leaves', color: 'bg-yellow-100 text-yellow-700' },
            { title: 'تقارير الأداء', subtitle: 'تقييمات الفريق الشهرية', icon: 'leaderboard', href: '/staff/reviews', color: 'bg-primary-container text-primary' },
          ].map(mod => (
            <div key={mod.title} className="card p-5 flex items-center gap-4 hover:bg-surface-container-low transition-colors cursor-pointer group">
              <div className={`w-12 h-12 rounded-2xl ${mod.color} flex items-center justify-center flex-shrink-0`}>
                <span className="material-symbols-outlined text-xl">{mod.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-on-surface">{mod.title}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{mod.subtitle}</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors">arrow_back</span>
            </div>
          ))}

          {/* Shift overview */}
          <div className="card p-6 space-y-4">
            <h3 className="text-base font-extrabold">توزيع الدوام اليوم</h3>
            {[
              { label: 'دوام صباحي', icon: 'wb_sunny', count: staff.filter(s => s.shift === 'صباحي').length, total: 4 },
              { label: 'دوام مسائي', icon: 'nights_stay', count: staff.filter(s => s.shift === 'مسائي').length, total: 6 },
            ].map(sh => (
              <div key={sh.label}>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="material-symbols-outlined text-base text-primary">{sh.icon}</span>
                    {sh.label}
                  </span>
                  <span className="text-on-surface-variant">{sh.count}/{sh.total}</span>
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(sh.count / sh.total) * 100}%`, background: 'linear-gradient(90deg, #944A00, #E67E22)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
