import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { Revenue } from '@/app/lib/definitions';

export default async function RevenueChart({
  revenue,
}: {
  revenue: Revenue[];
}) {
  const chartHeight = 350;
  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400 dark:text-slate-500">No data available.</p>;
  }

  return (
    <div className="w-full">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl dark:text-slate-100`}>
        Recent Revenue
      </h2>

      <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100 dark:bg-slate-900 dark:ring-slate-800">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4 dark:bg-slate-950">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex dark:text-slate-500"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {revenue.map((month) => (
            <div key={month.month} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-gradient-to-t from-blue-600 to-sky-400"
                style={{
                  height: `${(chartHeight / topLabel) * month.revenue}px`,
                }}
              />
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0 dark:text-slate-500">
                {month.month}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-slate-400" />
          <h3 className="ml-2 text-sm text-gray-500 dark:text-slate-400">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}
