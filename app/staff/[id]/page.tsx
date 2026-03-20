import { getStaffMember } from '@/lib/staff-store';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const SHIFT_COLOR: Record<string, string> = {
  morning: 'bg-amber-100 text-amber-800',
  evening: 'bg-blue-100 text-blue-800',
  split:   'bg-purple-100 text-purple-800',
  off:     'bg-zinc-100 text-zinc-400',
};
const SHIFT_LABEL: Record<string, string> = { morning: 'صباحي', evening: 'مسائي', split: 'مقسم', off: 'يوم راحة' };
const ATT_COLOR: Record<string, string> = { present: 'text-green-600', late: 'text-amber-600', absent: 'text-error', leave: 'text-blue-600' };
const ATT_LABEL: Record<string, string> = { present: 'حاضر', late: 'متأخر', absent: 'غائب', leave: 'إجازة' };

const fmt = (n: number) => new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(n);

export default function StaffDetailPage({ params }: { params: { id: string } }) {
  const member = getStaffMember(params.id);
  if (!member) notFound();

  const latestPayroll = member.payroll[0];
  const catLabel: Record<string, string> = { service: 'الخدمة', punctuality: 'الانضباط', teamwork: 'العمل الجماعي', presentation: 'المظهر' };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="flex items-center gap-4">
        <Link href="/staff" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors">
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        <h2 className="headline-sm">ملف الموظف</h2>
      </header>

      {/* Hero */}
      <div className="card p-8 flex flex-col md:flex-row gap-8 items-center md:items-start" style={{ background: 'linear-gradient(135deg,rgba(148,74,0,0.08),rgba(230,126,34,0.05))' }}>
        <div className="w-24 h-24 rounded-3xl bg-primary-container flex items-center justify-center text-primary text-4xl font-black flex-shrink-0">
          {member.name.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-right space-y-3">
          <div>
            <h3 className="display-md">{member.name}</h3>
            <p className="body-md text-on-surface-variant">{member.role} · {member.department}</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <a href={`tel:${member.phone}`} className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest text-sm font-bold hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-primary text-sm">call</span>{member.phone}
            </a>
            <a href={`mailto:${member.email}`} className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest text-sm font-bold hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-primary text-sm">mail</span>{member.email}
            </a>
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest text-sm font-bold">
              <span className="material-symbols-outlined text-primary text-sm">event</span>انضم: {member.joinDate}
            </span>
          </div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-4xl font-black text-primary">{member.performanceScore}%</div>
          <p className="text-xs text-on-surface-variant">الأداء العام</p>
          <div className="flex gap-0.5 justify-center mt-2">
            {[1,2,3,4,5].map(s => (
              <span key={s} className={`material-symbols-outlined text-sm ${s <= Math.round(member.rating) ? 'text-primary' : 'text-zinc-200'}`} style={{ fontVariationSettings: `'FILL' ${s <= Math.round(member.rating) ? 1 : 0}` }}>star</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly rota */}
        <div className="card surface-container-lowest p-6 space-y-4">
          <h3 className="title-lg flex items-center gap-2"><span className="material-symbols-outlined text-primary">calendar_month</span>جدول الأسبوع</h3>
          <div className="space-y-2">
            {member.rota.map(shift => (
              <div key={shift.day} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-colors">
                <span className="font-bold w-20">{shift.day}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-black ${SHIFT_COLOR[shift.type]}`}>{SHIFT_LABEL[shift.type]}</span>
                <span className="text-sm text-on-surface-variant">
                  {shift.type === 'off' ? '—' : `${shift.start} – ${shift.end}`}
                </span>
              </div>
            ))}
          </div>
          <Link href="/staff/rota" className="btn-secondary w-full justify-center">عرض الجدول الكامل</Link>
        </div>

        {/* Latest payslip summary */}
        <div className="card surface-container-lowest p-6 space-y-4">
          <h3 className="title-lg flex items-center gap-2"><span className="material-symbols-outlined text-primary">payments</span>الراتب — {latestPayroll?.month}</h3>
          {latestPayroll ? (
            <>
              <div className="space-y-3">
                {[
                  { label: 'الراتب الأساسي', value: latestPayroll.baseSalary, color: '' },
                  { label: 'الوقت الإضافي', value: latestPayroll.overtime, color: 'text-green-600' },
                  { label: 'المكافأة', value: latestPayroll.bonus, color: 'text-green-600' },
                  { label: 'الاستقطاعات', value: -latestPayroll.deductions, color: 'text-error' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center py-2 border-b border-outline-variant last:border-0">
                    <span className="text-on-surface-variant">{row.label}</span>
                    <span className={`font-bold ${row.color}`}>{fmt(Math.abs(row.value))}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2">
                  <span className="font-black text-lg">الصافي</span>
                  <span className="font-black text-2xl text-primary">{fmt(latestPayroll.net)}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href={`/staff/${member.id}/payslip` as any} className="btn-primary flex-1 justify-center">
                  <span className="material-symbols-outlined">receipt</span>قسيمة الراتب
                </Link>
                <Link href="/staff/payroll" className="btn-secondary flex-1 justify-center">كشف الرواتب</Link>
              </div>
            </>
          ) : <p className="text-on-surface-variant">لا توجد بيانات راتب</p>}
        </div>

        {/* Attendance */}
        <div className="card surface-container-lowest p-6 space-y-4">
          <h3 className="title-lg flex items-center gap-2"><span className="material-symbols-outlined text-primary">fingerprint</span>سجل الحضور</h3>
          <div className="space-y-2">
            {member.attendance.map(rec => (
              <div key={rec.date} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-colors">
                <span className="text-sm font-medium">{rec.date}</span>
                <span className={`text-sm font-bold ${ATT_COLOR[rec.status]}`}>{ATT_LABEL[rec.status]}</span>
                <span className="text-xs text-on-surface-variant">
                  {rec.status === 'leave' || rec.status === 'absent' ? '—' : `${rec.checkIn} – ${rec.checkOut}`}
                  {rec.lateMinutes > 0 && <span className="text-amber-600 mr-1">(+{rec.lateMinutes}د)</span>}
                </span>
              </div>
            ))}
          </div>
          <Link href="/staff/attendance" className="btn-secondary w-full justify-center">سجل الحضور الكامل</Link>
        </div>

        {/* Reviews */}
        <div className="card surface-container-lowest p-6 space-y-4">
          <h3 className="title-lg flex items-center gap-2"><span className="material-symbols-outlined text-primary">rate_review</span>التقييمات</h3>
          <div className="space-y-4">
            {member.reviews.map(rev => (
              <div key={rev.id} className="p-4 bg-surface-container-low rounded-2xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm">{rev.reviewerName}</p>
                    <p className="text-xs text-on-surface-variant">{rev.date} · {catLabel[rev.category]}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`material-symbols-outlined text-sm ${s <= rev.rating ? 'text-primary' : 'text-zinc-200'}`} style={{ fontVariationSettings: `'FILL' ${s <= rev.rating ? 1 : 0}` }}>star</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
          <Link href={`/staff/${member.id}/reviews` as any} className="btn-secondary w-full justify-center">كل التقييمات</Link>
        </div>
      </div>
    </div>
  );
}
