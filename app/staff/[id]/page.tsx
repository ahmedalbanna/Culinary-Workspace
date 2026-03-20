import { getStaffMember } from '@/lib/staff-store';
import { notFound } from 'next/navigation';
import { StaffDetailClient } from '@/components/staff/staff-detail-client';

export default function StaffDetailPage({ params }: { params: { id: string } }) {
  const member = getStaffMember(params.id);
  if (!member) notFound();
  return <StaffDetailClient member={member} />;
}
