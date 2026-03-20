'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  reservationId: string;
  guestName: string;
  tableLabel: string;
}

export function ReservationStatusControl({ reservationId, guestName, tableLabel }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showCancel, setShowCancel] = useState(false);
  const [showNoShow, setShowNoShow] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  async function patch(status: string) {
    setLoading(status);
    await fetch(`/api/reservations/${reservationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setLoading(null);
  }

  async function handleCancel() {
    setLoading('cancel');
    await fetch(`/api/reservations/${reservationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'waitlist' }),
    });
    setLoading(null);
    setShowCancel(false);
    router.push('/reservations');
  }

  async function handleNoShow() {
    setLoading('noshow');
    await fetch(`/api/reservations/${reservationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    });
    setLoading(null);
    setShowNoShow(false);
    router.push('/reservations');
  }

  return (
    <>
      {/* Fixed action sheet */}
      <div className="fixed bottom-0 left-0 w-full px-6 py-6 z-40"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(25,28,29,0.08)', borderRadius: '2rem 2rem 0 0', boxShadow: '0 -10px 30px rgba(0,0,0,0.04)' }}>
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          <button
            onClick={() => patch('seated')}
            disabled={!!loading}
            className="w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #944A00, #E67E22)', color: '#fff' }}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            {loading === 'seated' ? 'جارٍ التحديث...' : 'تأكيد الحضور'}
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCancel(true)}
              className="flex-1 py-3.5 rounded-full font-bold bg-surface-container-high text-on-surface-variant hover:bg-error-container hover:text-error transition-colors active:scale-95"
            >
              إلغاء الحجز
            </button>
            <button
              onClick={() => setShowNoShow(true)}
              className="flex-1 py-3.5 rounded-full font-bold bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors active:scale-95"
            >
              لم يحضر
            </button>
          </div>
        </div>
      </div>

      {/* Cancel modal */}
      {showCancel && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(25,28,29,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl p-8 space-y-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center">
                <span className="material-symbols-outlined text-error text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              </div>
              <h3 className="title-lg">إلغاء حجز {guestName}؟</h3>
              <p className="body-md text-on-surface-variant">سيتم تحرير الطاولة {tableLabel} وإرسال إشعار للعميل.</p>
            </div>
            <div className="space-y-3">
              {['تغيير في الخطط', 'ظرف طارئ', 'خطأ في الحجز', 'طلب العميل'].map(reason => (
                <button
                  key={reason}
                  onClick={() => setCancelReason(reason)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-colors ${cancelReason === reason ? 'bg-primary-container border-2 border-primary' : 'bg-surface-container-low hover:bg-surface-container'}`}
                >
                  <span className="font-medium">{reason}</span>
                  {cancelReason === reason && <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCancel}
                disabled={!cancelReason || loading === 'cancel'}
                className="w-full py-4 rounded-full font-bold text-lg bg-error text-white disabled:opacity-50 active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">cancel</span>
                {loading === 'cancel' ? 'جارٍ الإلغاء...' : 'تأكيد الإلغاء'}
              </button>
              <button onClick={() => setShowCancel(false)} className="w-full py-4 rounded-full font-bold bg-surface-container-low text-on-surface-variant">
                تراجع
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No-show modal */}
      {showNoShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(25,28,29,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-8 space-y-6 border-b-4 border-error">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-error-container flex items-center justify-center">
                <span className="material-symbols-outlined text-error text-5xl">person_off</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="headline-sm">تسجيل عدم الحضور</h3>
              <p className="body-md text-on-surface-variant">هل تريد تسجيل {guestName} كغير حاضر؟ سيؤثر ذلك على سجل العميل.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-4 rounded-xl text-center">
                <p className="text-xs text-on-surface-variant">الطاولة</p>
                <p className="font-bold">{tableLabel}</p>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl text-center">
                <p className="text-xs text-on-surface-variant">الضيف</p>
                <p className="font-bold truncate">{guestName}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleNoShow}
                disabled={loading === 'noshow'}
                className="w-full py-4 rounded-full font-bold text-lg bg-error text-white active:scale-95 transition-transform disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">check_circle</span>
                {loading === 'noshow' ? 'جارٍ التسجيل...' : 'تأكيد عدم الحضور'}
              </button>
              <button onClick={() => setShowNoShow(false)} className="w-full py-4 rounded-full font-bold bg-surface-container-low text-on-surface-variant">
                تراجع
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
