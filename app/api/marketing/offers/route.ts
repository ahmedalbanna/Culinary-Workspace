import { NextRequest, NextResponse } from 'next/server';
import { listOffers, createOffer } from '@/lib/marketing-store';
import type { MarketingOffer } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ offers: listOffers() });
}

export async function POST(request: NextRequest) {
  const body = await request.json() as Omit<MarketingOffer, 'id' | 'createdAt' | 'sentCount' | 'openRate' | 'redeemCount'>;
  const offer = createOffer(body);
  return NextResponse.json({ offer }, { status: 201 });
}
