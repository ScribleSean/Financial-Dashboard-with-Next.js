import { fetchCustomers } from '@/app/lib/data';
import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import TopBar from '@/app/ui/dashboard/top-bar';

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <TopBar title="Create invoice" subtitle="Issue a new invoice for an existing customer." />
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: 'Create Invoice', href: '/dashboard/invoices/create', active: true },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
