import { listLeaveRequests, listStaff } from '@/lib/staff-store';
import Link from 'next/link';

const TYPE_LABEL: Record<string, string> = { annual: 'سنوية', sick: 'مرضية', emergency: 'طارئة', unpaid: 'بدون راتب' };
const TYPE_COLOR: Record<string, string> = { annual: 'bg-blue-100 text-blue-700', sick: 'bg-red-100 text-red-700', emergency: 'bg-error-container text-error', unpaid: 'bg-zinc-100 text-zinc-600' };
const STATUS_COLOR: Record<string, string> = { pending: 'bg-amber-100 text-amber-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-error-container text-error' };
const STATUS_LABEL: Record<string, string> = { pending: 'معلق', approved: 'موافق عليه', rejected: 'مرفوض' };

export default function PendingRequestsPage() {
  const requests = listLeaveRequests().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  const staff = listStaff();
  const pending = requests.filter(r => r.status === 'pending');
  const others = requests.filter(r => r.status !== 'pending');

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/staff" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <div>
            <h2 className="headline-sm">طلبات الإجازة</h2>
            <p className="body-md text-on-surface-variant">{pending.length} طلب معلق في انتظار القرار</p>
          </div>
        </div>
        <Link href="/staff/leave/new" className="btn-primary">
          <span className="material-symbols-outlined">add</span>
          طلب جديد
        </Link>
      </header>

      {pending.length > 0 && (
        <section className="space-y-4">
          <h3 className="title-lg text-amber-700 flex items-center gap-2">
            <span className="material-symbols-outlined">pending_actions</span>
            تحتاج قراراً ({pending.length})
          </h3>
          {pending.map(req => {
            const member = staff.find(s => s.id === req.staffId);
            return (
              <div key={req.id} className="card surface-container-lowest p-6 space-y-5 border-r-4 border-amber-400">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container font-black text-xl">
                      {member?.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold">{member?.name}</h4>
                      <p className="text-xs text-on-surface-variant">{member?.role}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black ${TYPE_COLOR[req.type]}`}>
                    إجازة {TYPE_LABEL[req.type]}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-surface-container-low p-3 rounded-xl text-center">
                    <p className="text-[10px] text-on-surface-variant">من</p>
                    <p className="font-bold text-sm">{req.from}</p>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-xl text-center">
                    <p className="text-[10px] text-on-surface-variant">إلى</p>
                    <p className="font-bold text-sm">{req.to}</p>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-xl text-center">
                    <p className="text-[10px] text-on-surface-variant">المدة</p>
                    <p className="font-bold text-sm">{req.days} أيام</p>
                  </div>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl border-r-4 border-primary">
                  <p className="text-xs text-on-surface-variant mb-1">السبب</p>
                  <p className="text-sm">{req.reason}</p>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 transition-colors active:scale-95 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    موافقة
                  </button>
                  <button className="flex-1 py-3 rounded-full bg-error-container text-error font-bold hover:opacity-80 transition-opacity active:scale-95 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">cancel</span>
                    رفض
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {others.length > 0 && (
        <section className="space-y-4">
          <h3 className="title-lg text-on-surface-variant">السابقة</h3>
          {others.map(req => {
            const member = staff.find(s => s.id === req.staffId);
            return (
              <div key={req.id} className="card surface-container-lowest p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center font-black text-on-secondary-container">
                    {member?.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{member?.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      إجازة {TYPE_LABEL[req.type]} · {req.days} أيام · {req.from} ← {req.to}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-black flex-shrink-0 ${STATUS_COLOR[req.status]}`}>
                  {STATUS_LABEL[req.status]}
                </span>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
