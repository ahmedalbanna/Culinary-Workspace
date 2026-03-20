import { getStaffMember } from '@/lib/staff-store';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function PayslipPage({ params }: { params: { id: string } }) {
  const member = getStaffMember(params.id);
  if (!member) notFound();
  const payroll = member.payroll[0];
  if (!payroll) notFound();

  const fmt = (n: number) => new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(n);

  const rows = [
    { label: 'الراتب الأساسي', value: payroll.baseSalary, type: 'base' },
    { label: 'الوقت الإضافي', value: payroll.overtime, type: 'plus' },
    { label: 'المكافأة', value: payroll.bonus, type: 'plus' },
    { label: 'الاستقطاعات', value: payroll.deductions, type: 'minus' },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-8 pb-12">
      <header className="flex items-center gap-4">
        <Link href={`/staff/${member.id}` as any} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors">
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        <h2 className="headline-sm">قسيمة الراتب</h2>
      </header>

      {/* Pay slip card */}
      <div className="card surface-container-lowest overflow-hidden">
        {/* Header strip */}
        <div className="p-8 text-white" style={{ background: 'linear-gradient(135deg,#944A00,#E67E22)' }}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-black text-2xl">{member.name}</h3>
              <p className="text-white/80">{member.role} · {member.department}</p>
            </div>
            <div className="text-left">
              <p className="text-white/70 text-xs">الفترة</p>
              <p className="font-bold">{payroll.month}</p>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="p-8 space-y-4">
          {rows.map(row => (
            <div key={row.label} className="flex justify-between items-center py-3 border-b border-outline-variant last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${row.type === 'plus' ? 'bg-green-100' : row.type === 'minus' ? 'bg-error-container' : 'bg-primary-container'}`}>
                  <span className={`material-symbols-outlined text-sm ${row.type === 'plus' ? 'text-green-700' : row.type === 'minus' ? 'text-error' : 'text-primary'}`}>
                    {row.type === 'plus' ? 'add' : row.type === 'minus' ? 'remove' : 'account_balance'}
                  </span>
                </div>
                <span className="font-medium">{row.label}</span>
              </div>
              <span className={`font-bold ${row.type === 'plus' ? 'text-green-700' : row.type === 'minus' ? 'text-error' : ''}`}>
                {row.type === 'minus' ? '-' : ''}{fmt(row.value)}
              </span>
            </div>
          ))}

          {/* Net total */}
          <div className="mt-4 p-6 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg,rgba(148,74,0,0.08),rgba(230,126,34,0.06))' }}>
            <p className="text-sm text-on-surface-variant mb-1">صافي الراتب</p>
            <p className="text-4xl font-black text-primary">{fmt(payroll.net)}</p>
            <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-black ${payroll.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {payroll.isPaid ? '✓ تم الصرف' : 'في انتظار الصرف'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex gap-3">
          <button className="btn-primary flex-1 justify-center">
            <span className="material-symbols-outlined">download</span>
            تحميل PDF
          </button>
          <button className="btn-secondary flex-1 justify-center">
            <span className="material-symbols-outlined">share</span>
            مشاركة
          </button>
        </div>
      </div>
    </div>
  );
}
