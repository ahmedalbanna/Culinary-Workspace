import { getStaffMember } from '@/lib/staff-store';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReviewsClient } from '@/components/staff/reviews-client';

export default function StaffReviewsPage({ params }: { params: { id: string } }) {
  const member = getStaffMember(params.id);
  if (!member) notFound();
  return <ReviewsClient member={member} />;
}
