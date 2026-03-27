import {
  ArrowRightIcon,
  ChartBarSquareIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';

const highlights = [
  {
    title: 'Live KPIs',
    body: 'Collected revenue, pending AR, invoice volume, and customer counts update from your ledger or demo data.',
    icon: ChartBarSquareIcon,
  },
  {
    title: 'Analytics suite',
    body: 'Area, bar, composed, and pie charts for revenue, margin proxies, expenses, and cash movement.',
    icon: SparklesIcon,
  },
  {
    title: 'Secure access',
    body: 'Session-based sign-in with optional Postgres-backed users or instant demo credentials.',
    icon: ShieldCheckIcon,
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-24">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-blue-600 dark:text-sky-400">
          Pinnacle Finance
        </p>
        <h1
          className={`${lusitana.className} mt-4 text-center text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl`}
        >
          The financial dashboard your team actually uses
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-slate-600 dark:text-slate-400">
          Invoices, customers, analytics, budgets, exports, and dark mode — wired for Next.js App Router
          with graceful demo data when Postgres is not connected.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
          >
            Open dashboard
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline dark:text-slate-300"
          >
            Demo login: user@nextmail.com / 123456
          </Link>
        </div>
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <article
                key={h.title}
                className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
              >
                <Icon className="h-10 w-10 text-blue-600 dark:text-sky-400" />
                <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {h.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {h.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
