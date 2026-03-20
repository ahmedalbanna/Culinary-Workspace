import { listMenuItems, getMenuSummary } from '@/lib/menu-store';
import { MenuClient } from '@/components/menu/menu-client';

export default function MenuPage() {
  const items = listMenuItems();
  const summary = getMenuSummary();

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="display-md">إدارة القائمة</h2>
          <p className="body-md text-on-surface-variant">إدارة الأطباق، الأسعار، التوافر، والأقسام</p>
        </div>
      </header>
      <MenuClient items={items} summary={summary} />
    </div>
  );
}
