'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ConfirmArrivalButton({ reservationId }: { reservationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await fetch(`/api/reservations/${reservationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'seated' }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleConfirm}
      disabled={loading}
      className="flex-1 py-2.5 rounded-full bg-primary text-on-primary text-sm font-bold hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-60"
    >
      {loading ? '...' : 'تأكيد الوصول'}
    </button>
  );
}
