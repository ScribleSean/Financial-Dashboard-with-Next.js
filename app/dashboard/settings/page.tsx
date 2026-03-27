import TopBar from '@/app/ui/dashboard/top-bar';
import ThemeToggle from '@/app/ui/theme-toggle';

export default function Page() {
  return (
    <main>
      <TopBar
        title="Settings"
        subtitle="Workspace preferences and display options."
      />
      <div className="mt-8 max-w-xl space-y-6">
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-gray-900 dark:text-slate-100">Appearance</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
            Toggle dark mode. Your choice is saved in this browser.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <ThemeToggle />
            <span className="text-sm text-gray-600 dark:text-slate-400">Theme</span>
          </div>
        </section>
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-gray-900 dark:text-slate-100">Data source</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
            With <code className="rounded bg-gray-100 px-1 font-mono text-xs dark:bg-slate-800">POSTGRES_URL</code>{' '}
            configured, run{' '}
            <code className="rounded bg-gray-100 px-1 font-mono text-xs dark:bg-slate-800">
              npm run seed
            </code>{' '}
            to hydrate customers, invoices, revenue, and users. Without it, the app serves rich demo
            data so you can explore every screen offline.
          </p>
        </section>
      </div>
    </main>
  );
}
