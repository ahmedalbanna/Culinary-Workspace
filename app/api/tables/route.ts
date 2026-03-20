import { NextResponse } from 'next/server';
import { listTables, getTableSummary } from '@/lib/store';

export async function GET() {
  return NextResponse.json({
    tables: listTables(),
    summary: getTableSummary(),
  });
}
