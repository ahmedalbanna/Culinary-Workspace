'use client';

import { useState } from 'react';
import type { StaffMember } from '@/lib/types';

const CATEGORIES = [
  { value: 'service',      label: 'جودة الخدمة',       icon: 'restaurant_menu' },
  { value: 'punctuality',  label: 'الانضباط',           icon: 'schedule' },
  { value: 'teamwork',     label: 'العمل الجماعي',      icon: 'groups' },
  { value: 'presentation', label: 'المظهر والهندام',    icon: 'dry_cleaning' },
] as const;

type Category = typeof CATEGORIES[number]['value'];

interface Props {
  memberId: string;
  onSaved: (member: StaffMember) => void;
}

export function ReviewForm({ memberId, onSaved }: Props) {
  const [open,     setOpen]     = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [rating,   setRating]   = useState(5);
  const [hovered,  setHovered]  = useState(0);
  const [category, setCategory] = useState<Category>('service');
  const [reviewer, setReviewer] = useState('');
  const [comment,  setComment]  = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewer.trim() || !comment.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/staff/${memberId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        review: {
          reviewerName: reviewer,
          date: new Date().toISOString().split('T')[0],
          rating,
          category,
          comment,
        },
      }),
    });
    const data = await res.json();
    if (data.member) {
      onSaved(data.member);
      setSuccess(true);
      setReviewer(''); setComment(''); setRating(5); setCategory('service');
      setTimeout(() => { setSuccess(false); setOpen(false); }, 2000);
    }
    setSaving(false);
  }

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="btn-primary w-full justify-center py-3"
      >
        <span className="material-symbols-outlined">add_comment</span>
        إضافة تقييم جديد
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-6 card p-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="font-bold text-base flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">rate_review</span>
            تقييم جديد
          </h3>

          {success ? (
            <div className="py-8 text-center space-y-2">
              <span className="material-symbols-outlined text-5xl text-green-600 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <p className="font-bold text-green-700">تم حفظ التقييم بنجاح!</p>
            </div>
          ) : (
            <>
              {/* Reviewer name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-on-surface-variant">اسم المقيِّم *</label>
                <input value={reviewer} onChange={e => setReviewer(e.target.value)} required
                  placeholder="مثال: أحمد خالد" className="input-field py-3 ps-4" />
              </div>

              {/* Star rating */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface-variant">التقييم *</label>
                <div className="flex gap-2 items-center">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button"
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(s)}
                      className="focus:outline-none transition-transform hover:scale-125"
                    >
                      <span
                        className={`material-symbols-outlined text-3xl transition-colors ${s <= (hovered || rating) ? 'text-primary' : 'text-zinc-200'}`}
                        style={{ fontVariationSettings: `'FILL' ${s <= (hovered || rating) ? 1 : 0}` }}
                      >star</span>
                    </button>
                  ))}
                  <span className="text-sm font-bold text-on-surface-variant ms-2">{rating} / 5</span>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface-variant">المجال</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat.value} type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`flex items-center gap-2 p-3 rounded-2xl text-sm font-bold transition-all ${category === cat.value ? 'ring-2 ring-primary bg-primary-fixed/20 text-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}>
                      <span className="material-symbols-outlined text-base">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-on-surface-variant">التعليق *</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} required rows={3}
                  placeholder="اكتب ملاحظاتك وتقييمك التفصيلي هنا..."
                  className="input-field py-3 ps-4 resize-none" />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button type="button" onClick={() => setOpen(false)} className="btn-ghost flex-1 py-3 rounded-full">إلغاء</button>
                <button type="submit" disabled={saving || !reviewer.trim() || !comment.trim()}
                  className="btn-primary flex-1 py-3 rounded-full justify-center">
                  {saving
                    ? <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    : <span className="material-symbols-outlined">send</span>
                  }
                  {saving ? 'جاري الحفظ...' : 'نشر التقييم'}
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
}
