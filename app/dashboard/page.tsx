import {
  getDemoActivityFeed,
  getDemoCashFlowSeries,
  getDemoExpenseBreakdown,
  getDemoTopCustomers,
} from '@/app/lib/demo-queries';
import { fetchLatestInvoices, fetchRevenue } from '@/app/lib/data';
import { formatDateToLocal } from '@/app/lib/utils';
import {
  CashFlowClient,
  ExpensePieClient,
  RevenueAreaClient,
} from '@/app/ui/dashboard/dashboard-charts';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { OverviewCards } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import TopBar from '@/app/ui/dashboard/top-bar';
import InvoiceStatus from '@/app/ui/invoices/status';

export default async function Page() {
  const [revenue, latestInvoices, expenseMix, cashFlow, topCustomers, activity] =
    await Promise.all([
      fetchRevenue(),
      fetchLatestInvoices(),
      Promise.resolve(getDemoExpenseBreakdown()),
      Promise.resolve(getDemoCashFlowSeries()),
      Promise.resolve(getDemoTopCustomers(5)),
      Promise.resolve(getDemoActivityFeed(8)),
    ]);

  return (
    <main>
      <TopBar
        title="Overview"
        subtitle="Revenue, receivables, and operational signals at a glance."
      />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCards />
      </div>

      <section className="mt-8 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
          Revenue trend
        </h2>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Interactive view of the last twelve months.
        </p>
        <div className="mt-4">
          <RevenueAreaClient data={revenue} />
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <RevenueChart revenue={revenue} />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Expense mix (sample)
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Illustrative allocation based on annualized revenue.
          </p>
          <ExpensePieClient data={expenseMix} />
        </section>
        <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Cash in vs out (sample)
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Modeled from monthly revenue with a fixed outflow ratio.
          </p>
          <CashFlowClient data={cashFlow} />
        </section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Top customers by volume
          </h2>
          <ul className="mt-4 divide-y divide-gray-100 dark:divide-slate-800">
            {topCustomers.map((c, i) => (
              <li
                key={`${c.email}-${i}`}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-slate-100">{c.name}</p>
                  <p className="text-gray-500 dark:text-slate-400">{c.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-slate-100">
                    {c.totalFormatted}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-500">
                    Paid {c.paidFormatted}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Recent activity
          </h2>
          <ul className="mt-4 space-y-3">
            {activity.map((a) => (
              <li
                key={a.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 p-3 dark:border-slate-800"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                    {a.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-500">
                    {formatDateToLocal(a.date)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                    {a.detail}
                  </span>
                  <InvoiceStatus status={a.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
