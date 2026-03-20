import { listStaff } from '@/lib/staff-store';
import Link from 'next/link';

const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const SHIFT_COLOR: Record<string, string> = {
  morning: 'bg-amber-100 text-amber-800 border-amber-200',
  evening: 'bg-blue-100 text-blue-800 border-blue-200',
  split:   'bg-purple-100 text-purple-800 border-purple-200',
  off:     'bg-zinc-50 text-zinc-300 border-transparent',
};

export default function RotaPage() {
  const staff = listStaff();

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/staff" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <div>
            <h2 className="headline-sm">جدول الدوام الأسبوعي</h2>
            <p className="body-md text-on-surface-variant">عرض مناوبات كل الفريق لهذا الأسبوع</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">صباحي</span>
          <span className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">مسائي</span>
          <span className="px-3 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">مقسم</span>
          <span className="px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-500 text-xs font-bold">راحة</span>
        </div>
      </header>

      <div className="card surface-container-lowest overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="p-4 text-right label-md text-on-surface-variant uppercase tracking-wider w-48">الموظف</th>
              {DAYS.map(d => (
                <th key={d} className="p-4 label-md text-on-surface-variant uppercase tracking-wider text-center">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {staff.map(member => (
              <tr key={member.id} className="hover:bg-surface-container-low transition-colors">
                <td className="p-4">
                  <Link href={`/staff/${member.id}` as any} className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-primary font-black text-sm flex-shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm group-hover:text-primary transition-colors">{member.name}</p>
                      <p className="text-[10px] text-on-surface-variant">{member.role}</p>
                    </div>
                  </Link>
                </td>
                {DAYS.map(day => {
                  const shift = member.rota.find(s => s.day === day);
                  if (!shift) return <td key={day} className="p-2 text-center"><span className="text-zinc-300 text-xs">—</span></td>;
                  return (
                    <td key={day} className="p-2">
                      <div className={`rounded-xl border p-2 text-center text-[10px] font-bold ${SHIFT_COLOR[shift.type]}`}>
                        {shift.type === 'off' ? 'راحة' : (
                          <>
                            <div>{shift.start}</div>
                            <div className="opacity-60">إلى</div>
                            <div>{shift.end}</div>
                          </>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
