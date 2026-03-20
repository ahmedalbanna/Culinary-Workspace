import { NextRequest, NextResponse } from 'next/server';
import { getStaffMember, addStaffReview, updateStaffShift } from '@/lib/staff-store';
import type { ReviewEntry, ShiftEntry } from '@/lib/types';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const member = getStaffMember(params.id);
  if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ member });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json() as {
    review?: Omit<ReviewEntry, 'id'>;
    shiftDay?: string;
    shiftUpdate?: Partial<ShiftEntry>;
  };

  let member;
  if (body.review) {
    member = addStaffReview(params.id, body.review);
  } else if (body.shiftDay && body.shiftUpdate) {
    member = updateStaffShift(params.id, body.shiftDay, body.shiftUpdate);
  }

  if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ member });
}
