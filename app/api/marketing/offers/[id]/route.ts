import { NextRequest, NextResponse } from 'next/server';
import { getOffer, updateOfferStatus } from '@/lib/marketing-store';
import type { OfferStatus } from '@/lib/types';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const offer = getOffer(params.id);
  if (!offer) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ offer });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { status } = await request.json() as { status: OfferStatus };
  const offer = updateOfferStatus(params.id, status);
  if (!offer) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ offer });
}
