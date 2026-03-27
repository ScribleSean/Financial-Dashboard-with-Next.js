'use client';

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

type Row = Record<string, string | number>;

function escapeCell(v: string | number) {
  const s = String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export default function ExportCsvButton({
  rows,
  filename,
  label = 'Download CSV',
}: {
  rows: Row[];
  filename: string;
  label?: string;
}) {
  function download() {
    if (!rows.length) return;
    const keys = Object.keys(rows[0]);
    const header = keys.map(escapeCell).join(',');
    const body = rows
      .map((r) => keys.map((k) => escapeCell(r[k] ?? '')).join(','))
      .join('\n');
    const blob = new Blob([`${header}\n${body}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={download}
      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
    >
      <ArrowDownTrayIcon className="h-5 w-5" />
      {label}
    </button>
  );
}
