import { fetchRevenue } from '@/app/lib/data';
import {
  getDemoCashFlowSeries,
  getDemoExpenseBreakdown,
} from '@/app/lib/demo-queries';
import {
  AnalyticsComboClient,
  CashFlowClient,
  ExpensePieClient,
  RevenueAreaClient,
} from '@/app/ui/dashboard/dashboard-charts';
import TopBar from '@/app/ui/dashboard/top-bar';

export default async function Page() {
  const [revenue, expenseMix, cashFlow] = await Promise.all([
    fetchRevenue(),
    Promise.resolve(getDemoExpenseBreakdown()),
    Promise.resolve(getDemoCashFlowSeries()),
  ]);

  return (
    <main className="space-y-10">
      <TopBar
        title="Analytics"
        subtitle="Deeper cuts on revenue, margin proxy, expenses, and liquidity."
      />
      <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
          Revenue & estimated margin
        </h2>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Bars show booked revenue; the line approximates gross margin using a fixed ratio for
          illustration.
        </p>
        <AnalyticsComboClient data={revenue} />
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Revenue (area)
          </h2>
          <RevenueAreaClient data={revenue} />
        </section>
        <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Expense allocation
          </h2>
          <ExpensePieClient data={expenseMix} />
        </section>
      </div>
      <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
          Monthly cash movement
        </h2>
        <CashFlowClient data={cashFlow} />
      </section>
    </main>
  );
}
