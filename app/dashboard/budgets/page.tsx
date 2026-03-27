import { getDemoBudgets } from '@/app/lib/demo-queries';
import TopBar from '@/app/ui/dashboard/top-bar';

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function Page() {
  const budgets = getDemoBudgets();

  return (
    <main>
      <TopBar
        title="Budgets"
        subtitle="Quarterly envelopes with progress toward caps (sample data)."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {budgets.map((b) => {
          const pct = Math.min(100, Math.round((b.spent / b.cap) * 100));
          return (
            <article
              key={b.category}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    {b.category}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-slate-500">{b.period}</p>
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                  {pct}% used
                </span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-gray-600 dark:text-slate-400">
                  Spent {money.format(b.spent)}
                </span>
                <span className="text-gray-900 dark:text-slate-200">
                  Cap {money.format(b.cap)}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
