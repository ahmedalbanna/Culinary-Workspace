import { getCustomer, listReservations } from '@/lib/store';
import { getOrdersByCustomer } from '@/lib/orders-store';
import { listOffers } from '@/lib/marketing-store';
import { notFound } from 'next/navigation';
import { CustomerDetailClient } from '@/components/customers/customer-detail-client';

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = getCustomer(params.id);
  if (!customer) notFound();

  const reservations  = listReservations().filter(r => r.customerId === customer.id);
  const orders        = getOrdersByCustomer(customer.id);
  const activeOffers  = listOffers().filter(o => o.status === 'active');

  return <CustomerDetailClient customer={customer} reservations={reservations} orders={orders} activeOffers={activeOffers} />;
}
