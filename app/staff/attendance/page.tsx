import { listStaff } from '@/lib/staff-store';
import Link from 'next/link';

const ATT_COLOR: Record<string, string> = { present: 'bg-green-100 text-green-700', late: 'bg-amber-100 text-amber-700', absent: 'bg-error-container text-error', leave: 'bg-blue-100 text-blue-700' };
const ATT_LABEL: Record<string, string> = { present: 'حاضر', late: 'متأخر', absent: 'غائب', leave: 'إجازة' };

export default function AttendancePage() {
  const staff = listStaff();

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <Link href="/staff" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors">
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        <div>
          <h2 className="headline-sm">سجل الحضور والغياب</h2>
          <p className="body-md text-on-surface-variant">متابعة تسجيل دخول وخروج كل الفريق</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {staff.map(member => (
          <div key={member.id} className="card surface-container-lowest p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Link href={`/staff/${member.id}` as any} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center text-primary font-black text-xl">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold group-hover:text-primary transition-colors">{member.name}</h4>
                  <p className="text-xs text-on-surface-variant">{member.role}</p>
                </div>
              </Link>
              <div className="text-left">
                <p className="text-xs text-on-surface-variant">أيام متأخرة هذا الشهر</p>
                <p className="font-black text-lg text-amber-600">
                  {member.attendance.filter(a => a.status === 'late').length} أيام
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">
                    <th className="pb-2 text-right">التاريخ</th>
                    <th className="pb-2 text-center">الحالة</th>
                    <th className="pb-2 text-center">الدخول</th>
                    <th className="pb-2 text-center">الخروج</th>
                    <th className="pb-2 text-center">التأخير</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {member.attendance.map(rec => (
                    <tr key={rec.date} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 font-medium">{rec.date}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${ATT_COLOR[rec.status]}`}>
                          {ATT_LABEL[rec.status]}
                        </span>
                      </td>
                      <td className="py-3 text-center text-on-surface-variant">{rec.checkIn || '—'}</td>
                      <td className="py-3 text-center text-on-surface-variant">{rec.checkOut || '—'}</td>
                      <td className="py-3 text-center">
                        {rec.lateMinutes > 0 ? (
                          <span className="text-amber-600 font-bold">+{rec.lateMinutes}د</span>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
