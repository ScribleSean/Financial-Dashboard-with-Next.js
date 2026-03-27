import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { LatestInvoice } from '@/app/lib/definitions';
import Avatar from '@/app/ui/avatar';

export default async function LatestInvoices({
  latestInvoices,
}: {
  latestInvoices: LatestInvoice[];
}) {
  return (
    <div className="flex w-full flex-col">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl dark:text-slate-100`}>
        Latest Invoices
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100 dark:bg-slate-900 dark:ring-slate-800">
        <div className="bg-white px-6 dark:bg-slate-950">
          {latestInvoices.map((invoice, i) => {
            return (
              <div
                key={invoice.id}
                className={clsx('flex flex-row items-center justify-between py-4', {
                  'border-t border-gray-100 dark:border-slate-800': i !== 0,
                })}
              >
                <div className="flex min-w-0 items-center">
                  <Avatar name={invoice.name} className="mr-4" size={32} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base dark:text-slate-100">
                      {invoice.name}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block dark:text-slate-400">
                      {invoice.email}
                    </p>
                  </div>
                </div>
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base dark:text-slate-100`}
                >
                  {invoice.amount}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500 dark:text-slate-400" />
          <h3 className="ml-2 text-sm text-gray-500 dark:text-slate-400">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
