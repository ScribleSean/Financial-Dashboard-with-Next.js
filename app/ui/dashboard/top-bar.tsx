import ThemeToggle from '@/app/ui/theme-toggle';

export default function TopBar({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-slate-50">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </div>
  );
}
