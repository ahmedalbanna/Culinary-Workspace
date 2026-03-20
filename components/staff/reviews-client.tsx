'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { StaffMember } from '@/lib/types';
import { ReviewForm } from '@/components/staff/review-form';

const CAT_LABEL: Record<string, string> = { service: 'جودة الخدمة', punctuality: 'الانضباط', teamwork: 'العمل الجماعي', presentation: 'المظهر والهندام' };
const CAT_ICON: Record<string, string>  = { service: 'restaurant_menu', punctuality: 'schedule', teamwork: 'groups', presentation: 'dry_cleaning' };

interface Props { member: StaffMember; }

export function ReviewsClient({ member: initial }: Props) {
  const [member, setMember] = useState<StaffMember>(initial);

  const avgRating = member.reviews.length
    ? (member.reviews.reduce((s, r) => s + r.rating, 0) / member.reviews.length).toFixed(1)
    : '—';

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <header className="flex items-center gap-4">
        <Link href={`/staff/${member.id}` as any} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors">
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        <div>
          <h2 className="headline-sm">تقييمات {member.name}</h2>
          <p className="body-md text-on-surface-variant">{member.reviews.length} تقييم · معدل {avgRating} / 5</p>
        </div>
      </header>

      {/* Performance overview */}
      <div className="card surface-container-lowest p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="label-md text-on-surface-variant">متوسط التقييم</p>
            <p className="display-md text-primary">{avgRating}</p>
          </div>
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
              <span key={s} className={`material-symbols-outlined text-2xl ${s <= Math.round(member.rating) ? 'text-primary' : 'text-zinc-200'}`}
                style={{ fontVariationSettings: `'FILL' ${s <= Math.round(member.rating) ? 1 : 0}` }}>star</span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {[5,4,3,2,1].map(stars => {
            const count = member.reviews.filter(r => r.rating === stars).length;
            const pct = member.reviews.length ? Math.round((count / member.reviews.length) * 100) : 0;
            return (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm font-bold w-4">{stars}</span>
                <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%`, transition: 'width 0.5s ease' }} />
                </div>
                <span className="text-xs text-on-surface-variant w-8">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Performance score bar */}
        <div className="pt-2 border-t border-outline-variant/20 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-bold">درجة الأداء العامة</span>
            <span className="font-black text-primary">{member.performanceScore}%</span>
          </div>
          <div className="h-3 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${member.performanceScore}%`, background: 'linear-gradient(90deg,#944A00,#E67E22)' }} />
          </div>
        </div>
      </div>

      {/* Add review form */}
      <ReviewForm memberId={member.id} onSaved={setMember} />

      {/* Review cards */}
      <div className="space-y-4">
        {member.reviews.map(rev => (
          <div key={rev.id} className="card surface-container-lowest p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center font-black text-on-secondary-container">
                  {rev.reviewerName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold">{rev.reviewerName}</p>
                  <p className="text-xs text-on-surface-variant">{rev.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-xs font-bold">
                  <span className="material-symbols-outlined text-primary text-xs">{CAT_ICON[rev.category]}</span>
                  {CAT_LABEL[rev.category]}
                </span>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={`material-symbols-outlined text-sm ${s <= rev.rating ? 'text-primary' : 'text-zinc-200'}`}
                  style={{ fontVariationSettings: `'FILL' ${s <= rev.rating ? 1 : 0}` }}>star</span>
              ))}
            </div>
            <p className="body-md text-on-surface-variant italic border-s-4 border-primary ps-4">"{rev.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
