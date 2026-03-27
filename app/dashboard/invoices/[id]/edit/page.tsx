import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
import { getDemoInvoiceStaticParams } from '@/app/lib/demo-queries';
import { notFound } from 'next/navigation';
import EditInvoiceForm from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import TopBar from '@/app/ui/dashboard/top-bar';

export function generateStaticParams() {
  return getDemoInvoiceStaticParams();
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) notFound();

  return (
    <main>
      <TopBar title="Edit invoice" subtitle="Update amount, customer, or payment status." />
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: 'Edit Invoice', href: `/dashboard/invoices/${id}/edit`, active: true },
        ]}
      />
      <EditInvoiceForm invoice={invoice} customers={customers} />
    </main>
  );
}
