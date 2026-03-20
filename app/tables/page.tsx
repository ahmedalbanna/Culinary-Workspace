import { listTables, getTableSummary } from '@/lib/store';
import { TableFloorPlan } from '@/components/tables/table-floor-plan';
import Link from 'next/link';

export default function TablesPage() {
  const tables = listTables();
  const summary = getTableSummary();

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="display-md text-on-surface">الطاولات</h2>
          <p className="body-md text-on-surface-variant">إدارة حالة الطاولات والإشغال الفوري للقاعة</p>
        </div>
        <div className="flex gap-3">
          <Link href="/reservations/new" className="btn-secondary flex items-center gap-2">
            <span className="material-symbols-outlined">add</span>
            حجز جديد
          </Link>
        </div>
      </header>

      <TableFloorPlan tables={tables} summary={summary} />
    </div>
  );
}
