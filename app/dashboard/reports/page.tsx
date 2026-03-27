import { fetchInvoiceExportRows } from '@/app/lib/data';
import ExportCsvButton from '@/app/ui/dashboard/export-csv-button';
import TopBar from '@/app/ui/dashboard/top-bar';

export default async function Page() {
  const rows = await fetchInvoiceExportRows();
  const csvRows = rows.map((r) => ({
    id: r.id,
    customer: r.customer,
    email: r.email,
    amount: r.amount,
    date: r.date,
    status: r.status,
  }));

  return (
    <main>
      <TopBar
        title="Reports"
        subtitle="Export the full invoice register for accounting or BI tools."
      />
      <div className="mt-8 flex flex-col gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Invoice register
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
            {rows.length} rows · UTF-8 CSV with quoted fields
          </p>
        </div>
        <ExportCsvButton rows={csvRows} filename="pinnacle-invoices" label="Export CSV" />
      </div>
      <div className="mt-8 overflow-x-auto rounded-xl border border-gray-100 dark:border-slate-800">
        <table className="min-w-full text-left text-sm dark:text-slate-100">
          <thead className="bg-gray-50 text-gray-700 dark:bg-slate-900 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white dark:divide-slate-800 dark:bg-slate-950">
            {rows.slice(0, 12).map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3">{r.customer}</td>
                <td className="px-4 py-3 font-medium">{r.amount}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-slate-400">{r.date}</td>
                <td className="px-4 py-3 capitalize">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length > 12 ? (
          <p className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500">
            Previewing 12 of {rows.length} rows. Download CSV for the full extract.
          </p>
        ) : null}
      </div>
    </main>
  );
}
