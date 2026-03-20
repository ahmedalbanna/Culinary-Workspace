'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Order, OrderStatus, PaymentMethod } from '@/lib/types';
import { useRealtime } from '@/hooks/use-realtime';

const PAY_METHODS: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: 'cash',      label: 'نقداً',    icon: 'payments' },
  { value: 'card',      label: 'بطاقة',    icon: 'credit_card' },
  { value: 'apple-pay', label: 'Apple Pay', icon: 'phone_iphone' },
  { value: 'split',     label: 'مقسم',     icon: 'call_split' },
];

const fmt = (n: number) => new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 2 }).format(n);

export function OrderStatusControl({ orderId, currentStatus, total }: { orderId: string; currentStatus: OrderStatus; total: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('card');

  // Live updates — refresh if this order was updated from another tab
  useRealtime({
    'order:updated': (updated: Order) => {
      if (updated.id === orderId) router.refresh();
    },
  });

  async function patch(status: OrderStatus) {
    setLoading(true);
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  async function handlePay() {
    setLoading(true);
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'paid', paymentMethod: payMethod }),
    });
    setLoading(false);
    setShowPayment(false);
    router.refresh();
  }

  return (
    <>
      <div
        className="fixed bottom-0 left-0 w-full px-6 py-6 z-40"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(25,28,29,0.08)', borderRadius: '2rem 2rem 0 0' }}
      >
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {currentStatus === 'open' && (
            <button
              onClick={() => patch('served')}
              disabled={loading}
              className="w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60 bg-blue-600 text-white"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>room_service</span>
              {loading ? 'جارٍ التحديث...' : 'تم التقديم'}
            </button>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setShowPayment(true)}
              disabled={loading}
              className="flex-1 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#944A00,#E67E22)', color: 'white' }}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              تحصيل الدفع
            </button>
            <button
              onClick={() => patch('cancelled')}
              disabled={loading}
              className="px-6 py-4 rounded-full font-bold bg-error-container text-error hover:opacity-80 transition-opacity active:scale-95 disabled:opacity-60"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>

      {/* Payment modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(25,28,29,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl p-8 space-y-6">
            <div className="text-center space-y-1">
              <h3 className="headline-sm">تحصيل الدفع</h3>
              <p className="display-md text-primary">{fmt(total)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {PAY_METHODS.map(m => (
                <button
                  key={m.value}
                  onClick={() => setPayMethod(m.value)}
                  className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${payMethod === m.value ? 'ring-2 ring-primary bg-primary-container/20 font-black' : 'bg-surface-container-low hover:bg-surface-container-high'}`}
                >
                  <span className={`material-symbols-outlined ${payMethod === m.value ? 'text-primary' : 'text-on-surface-variant'}`}>{m.icon}</span>
                  <span className="font-bold">{m.label}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#944A00,#E67E22)', color: 'white' }}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                {loading ? 'جارٍ التأكيد...' : 'تأكيد الدفع'}
              </button>
              <button onClick={() => setShowPayment(false)} className="w-full py-4 rounded-full font-bold bg-surface-container-low text-on-surface-variant">
                تراجع
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
