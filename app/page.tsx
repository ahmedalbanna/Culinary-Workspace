import { DashboardApp } from '@/components/dashboard-app';
import { getDashboardSnapshot } from '@/lib/store';

export default function HomePage() {
  const snapshot = getDashboardSnapshot();

  return <DashboardApp initialData={snapshot} />;
}
