import type {
  CustomerField,
  FormattedCustomersTable,
  InvoiceForm,
  InvoicesTable,
  LatestInvoice,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

// eslint-disable-next-line
const { customers, invoices, revenue } = require('./placeholder-data.js') as {
  customers: Array<{
    id: string;
    name: string;
    email: string;
    image_url: string;
  }>;
  invoices: Array<{
    customer_id: string;
    amount: number;
    status: 'pending' | 'paid';
    date: string;
  }>;
  revenue: Revenue[];
};

const ITEMS_PER_PAGE = 6;

function demoInvoiceId(index: number): string {
  const hex = (index + 1).toString(16).padStart(12, '0');
  return `00000000-0000-4000-8000-${hex}`;
}

/** IDs used for static export (e.g. GitHub Pages) — matches seeded demo invoices order. */
export function getDemoInvoiceStaticParams() {
  return invoices.map((_, i) => ({ id: demoInvoiceId(i) }));
}

function customerById(id: string) {
  return customers.find((c) => c.id === id);
}

function buildInvoicesTable(): InvoicesTable[] {
  return invoices.map((inv, i) => {
    const c = customerById(inv.customer_id);
    return {
      id: demoInvoiceId(i),
      customer_id: inv.customer_id,
      name: c?.name ?? 'Unknown',
      email: c?.email ?? '',
      image_url: c?.image_url ?? '',
      date: inv.date,
      amount: inv.amount,
      status: inv.status,
    };
  });
}

function matchesInvoiceQuery(row: InvoicesTable, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    row.name.toLowerCase().includes(q) ||
    row.email.toLowerCase().includes(q) ||
    String(row.amount).includes(q) ||
    row.date.toLowerCase().includes(q) ||
    row.status.toLowerCase().includes(q)
  );
}

export function filterInvoicesByQuery(
  rows: InvoicesTable[],
  query: string,
): InvoicesTable[] {
  return rows.filter((r) => matchesInvoiceQuery(r, query));
}

export function getDemoAllInvoicesTable(): InvoicesTable[] {
  return buildInvoicesTable().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getDemoRevenue(): Revenue[] {
  return [...revenue];
}

export function getDemoLatestInvoices(): LatestInvoice[] {
  const rows = buildInvoicesTable()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    image_url: r.image_url,
    email: r.email,
    amount: formatCurrency(r.amount),
  }));
}

export function getDemoCardData() {
  const list = buildInvoicesTable();
  const numberOfInvoices = list.length;
  const numberOfCustomers = customers.length;
  let paid = 0;
  let pending = 0;
  for (const inv of list) {
    if (inv.status === 'paid') paid += inv.amount;
    else pending += inv.amount;
  }
  return {
    numberOfCustomers,
    numberOfInvoices,
    totalPaidInvoices: formatCurrency(paid),
    totalPendingInvoices: formatCurrency(pending),
  };
}

export function getDemoFilteredInvoices(
  query: string,
  currentPage: number,
): InvoicesTable[] {
  const filtered = buildInvoicesTable()
    .filter((r) => matchesInvoiceQuery(r, query))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  return filtered.slice(offset, offset + ITEMS_PER_PAGE);
}

export function getDemoInvoicesPages(query: string) {
  const filtered = buildInvoicesTable().filter((r) =>
    matchesInvoiceQuery(r, query),
  );
  return Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
}

export function getDemoInvoiceById(id: string): InvoiceForm | undefined {
  const list = buildInvoicesTable();
  const idx = list.findIndex((r) => r.id === id);
  if (idx < 0) return undefined;
  const row = list[idx];
  return {
    id: row.id,
    customer_id: row.customer_id,
    amount: row.amount / 100,
    status: row.status,
  };
}

export function getDemoCustomers(): CustomerField[] {
  return customers
    .map((c) => ({ id: c.id, name: c.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function matchesCustomerQuery(
  c: (typeof customers)[0],
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
  );
}

export function filterCustomersRowsByQuery<
  T extends { name: string; email: string },
>(rows: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(
    (c) =>
      c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
  );
}

export function getDemoFilteredCustomers(
  query: string,
): FormattedCustomersTable[] {
  const list = buildInvoicesTable();
  return customers
    .filter((c) => matchesCustomerQuery(c, query))
    .map((c) => {
      const mine = list.filter((inv) => inv.customer_id === c.id);
      let totalPending = 0;
      let totalPaid = 0;
      for (const inv of mine) {
        if (inv.status === 'pending') totalPending += inv.amount;
        else totalPaid += inv.amount;
      }
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        image_url: c.image_url,
        total_invoices: mine.length,
        total_pending: formatCurrency(totalPending),
        total_paid: formatCurrency(totalPaid),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export { ITEMS_PER_PAGE as DEMO_ITEMS_PER_PAGE };

export type ExpenseSlice = { name: string; value: number };
export type CashFlowPoint = { month: string; inflow: number; outflow: number };

/** Synthetic expense mix for dashboards (USD, same scale as monthly revenue). */
export function getDemoExpenseBreakdown(): ExpenseSlice[] {
  const total = revenue.reduce((s, r) => s + r.revenue, 0);
  const parts = [
    { name: 'Payroll & benefits', pct: 0.38 },
    { name: 'Operations', pct: 0.22 },
    { name: 'Marketing', pct: 0.14 },
    { name: 'Software & infra', pct: 0.12 },
    { name: 'Other', pct: 0.14 },
  ];
  return parts.map((p) => ({
    name: p.name,
    value: Math.round(total * p.pct),
  }));
}

export function getDemoCashFlowSeries(): CashFlowPoint[] {
  return revenue.map((r) => ({
    month: r.month,
    inflow: r.revenue,
    outflow: Math.round(r.revenue * 0.68),
  }));
}

export function getDemoTopCustomers(limit = 5) {
  const list = buildInvoicesTable();
  const byCustomer = new Map<
    string,
    { name: string; email: string; total: number; paid: number; pending: number }
  >();
  for (const inv of list) {
    const cur = byCustomer.get(inv.customer_id) ?? {
      name: inv.name,
      email: inv.email,
      total: 0,
      paid: 0,
      pending: 0,
    };
    cur.total += inv.amount;
    if (inv.status === 'paid') cur.paid += inv.amount;
    else cur.pending += inv.amount;
    cur.name = inv.name;
    cur.email = inv.email;
    byCustomer.set(inv.customer_id, cur);
  }
  return Array.from(byCustomer.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
    .map((c) => ({
      ...c,
      totalFormatted: formatCurrency(c.total),
      paidFormatted: formatCurrency(c.paid),
    }));
}

export function getDemoActivityFeed(limit = 8) {
  return buildInvoicesTable()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map((r) => ({
      id: r.id,
      title: `${r.status === 'paid' ? 'Payment' : 'Invoice'} · ${r.name}`,
      detail: formatCurrency(r.amount),
      date: r.date,
      status: r.status,
    }));
}

export function getDemoInvoiceExportRows() {
  return buildInvoicesTable()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((r) => ({
      id: r.id,
      customer: r.name,
      email: r.email,
      amount: formatCurrency(r.amount),
      date: r.date,
      status: r.status,
    }));
}

export function getDemoBudgets() {
  return [
    {
      category: 'Marketing',
      spent: 12400,
      cap: 18000,
      period: 'Q1 2026',
    },
    {
      category: 'Travel',
      spent: 6200,
      cap: 10000,
      period: 'Q1 2026',
    },
    {
      category: 'Software',
      spent: 8900,
      cap: 12000,
      period: 'Q1 2026',
    },
    {
      category: 'Contractors',
      spent: 22100,
      cap: 25000,
      period: 'Q1 2026',
    },
  ];
}
