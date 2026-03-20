import { getOrder } from '@/lib/orders-store';
import { getCustomer } from '@/lib/store';
import { listMenuItems } from '@/lib/menu-store';
import { notFound } from 'next/navigation';
import { OrderDetailClient } from '@/components/orders/order-detail-client';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order    = getOrder(params.id);
  if (!order) notFound();
  const customer  = getCustomer(order.customerId);
  const menuItems = listMenuItems();

  return <OrderDetailClient order={order} customer={customer} menuItems={menuItems} />;
}
