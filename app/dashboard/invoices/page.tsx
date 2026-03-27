import { fetchAllInvoicesForTable } from '@/app/lib/data';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import InvoicesInteractive from './invoices-interactive';

export default async function Page() {
  const allRows = await fetchAllInvoicesForTable();
  const demo = !process.env.POSTGRES_URL;

  return (
    <Suspense fallback={<InvoicesTableSkeleton />}>
      <InvoicesInteractive allRows={allRows} demo={demo} />
    </Suspense>
  );
}
