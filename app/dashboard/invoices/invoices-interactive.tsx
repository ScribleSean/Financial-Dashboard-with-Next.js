'use client';

import type { InvoicesTable as InvoicesTableRow } from '@/app/lib/definitions';
import { filterInvoicesByQuery } from '@/app/lib/demo-queries';
import { lusitana } from '@/app/ui/fonts';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import InvoicesTable from '@/app/ui/invoices/table';
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import TopBar from '@/app/ui/dashboard/top-bar';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

const ITEMS_PER_PAGE = 6;

export default function InvoicesInteractive({
  allRows,
  demo,
}: {
  allRows: InvoicesTableRow[];
  demo: boolean;
}) {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') ?? '';
  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);
  const errorDemo = searchParams.get('error') === 'demo';

  const { pageRows, totalPages, safePage } = useMemo(() => {
    const filtered = filterInvoicesByQuery(allRows, query);
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const offset = (safePage - 1) * ITEMS_PER_PAGE;
    const pageRows = filtered.slice(offset, offset + ITEMS_PER_PAGE);
    return { pageRows, totalPages, safePage };
  }, [allRows, query, currentPage]);

  return (
    <div className="w-full">
      <TopBar
        title="Invoices"
        subtitle="Search, filter, and reconcile every invoice in one place."
      />
      {errorDemo ? (
        <p
          className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
          role="status"
        >
          Invoices are read-only in demo mode. Add <code className="font-mono">POSTGRES_URL</code>{' '}
          and run <code className="font-mono">npm run seed</code> to enable create, edit, and delete.
        </p>
      ) : null}
      {demo ? (
        <p className="mt-4 text-sm text-gray-600 dark:text-slate-400">
          You are viewing seeded <strong>demo data</strong> without a live database connection.
        </p>
      ) : null}
      <div className="mt-8 flex items-center justify-between gap-4">
        <h1 className={`${lusitana.className} text-2xl dark:text-slate-100`}>All invoices</h1>
        <CreateInvoice />
      </div>
      <div className="mt-4 md:mt-8">
        <Search placeholder="Search invoices..." defaultValue={query} />
      </div>
      <InvoicesTable invoices={pageRows} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} currentPage={safePage} />
      </div>
    </div>
  );
}
