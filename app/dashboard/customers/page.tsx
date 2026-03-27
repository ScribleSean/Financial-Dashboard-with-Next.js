import { fetchFilteredCustomers } from '@/app/lib/data';
import CustomersTable from '@/app/ui/customers/table';
import TopBar from '@/app/ui/dashboard/top-bar';
import { Suspense } from 'react';

function TableFallback() {
  return (
    <div className="mt-8 h-48 animate-pulse rounded-lg bg-gray-100 dark:bg-slate-800" />
  );
}

export default async function Page() {
  const customers = await fetchFilteredCustomers('');

  return (
    <div className="w-full">
      <TopBar
        title="Customers"
        subtitle="Lifetime value, exposure, and invoice counts per account."
      />
      <Suspense fallback={<TableFallback />}>
        <CustomersTable customers={customers} />
      </Suspense>
    </div>
  );
}
