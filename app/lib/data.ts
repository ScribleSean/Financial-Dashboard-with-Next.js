import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import {
  getDemoAllInvoicesTable,
  getDemoCardData,
  getDemoCustomers,
  getDemoFilteredCustomers,
  getDemoFilteredInvoices,
  getDemoInvoiceById,
  getDemoInvoiceExportRows,
  getDemoInvoicesPages,
  getDemoLatestInvoices,
  getDemoRevenue,
} from './demo-queries';

function postgresConfigured(): boolean {
  return Boolean(process.env.POSTGRES_URL);
}

export async function fetchRevenue() {
  if (!postgresConfigured()) return getDemoRevenue();
  try {
    const data = await sql<Revenue>`SELECT * FROM revenue`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    return getDemoRevenue();
  }
}

export async function fetchLatestInvoices() {
  if (!postgresConfigured()) {
    return getDemoLatestInvoices();
  }
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    return data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
  } catch (error) {
    console.error('Database Error:', error);
    return getDemoLatestInvoices();
  }
}

export async function fetchCardData() {
  if (!postgresConfigured()) return getDemoCardData();
  try {
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    return getDemoCardData();
  }
}

const ITEMS_PER_PAGE = 6;

/** Full list for client-side filtering (also used for static export). */
export async function fetchAllInvoicesForTable(): Promise<InvoicesTable[]> {
  if (!postgresConfigured()) return getDemoAllInvoicesTable();
  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
    `;
    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    return getDemoAllInvoicesTable();
  }
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  if (!postgresConfigured()) {
    return getDemoFilteredInvoices(query, currentPage);
  }
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    return getDemoFilteredInvoices(query, currentPage);
  }
}

export async function fetchInvoicesPages(query: string) {
  if (!postgresConfigured()) return getDemoInvoicesPages(query);
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    return Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    return getDemoInvoicesPages(query);
  }
}

export async function fetchInvoiceById(id: string) {
  if (!postgresConfigured()) {
    return getDemoInvoiceById(id);
  }
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((row) => ({
      ...row,
      amount: row.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    return getDemoInvoiceById(id);
  }
}

export async function fetchCustomers() {
  if (!postgresConfigured()) return getDemoCustomers();
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    return getDemoCustomers();
  }
}

export async function fetchFilteredCustomers(query: string) {
  if (!postgresConfigured()) return getDemoFilteredCustomers(query);
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    return data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));
  } catch (err) {
    console.error('Database Error:', err);
    return getDemoFilteredCustomers(query);
  }
}

export type InvoiceExportRow = {
  id: string;
  customer: string;
  email: string;
  amount: string;
  date: string;
  status: string;
};

export async function fetchInvoiceExportRows(): Promise<InvoiceExportRow[]> {
  if (!postgresConfigured()) return getDemoInvoiceExportRows();
  try {
    const data = await sql<{
      id: string;
      name: string;
      email: string;
      amount: number;
      date: string;
      status: string;
    }>`
      SELECT
        invoices.id,
        customers.name,
        customers.email,
        invoices.amount,
        invoices.date,
        invoices.status
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
    `;
    return data.rows.map((r) => ({
      id: r.id,
      customer: r.name,
      email: r.email,
      amount: formatCurrency(r.amount),
      date: r.date,
      status: r.status,
    }));
  } catch (error) {
    console.error('Database Error:', error);
    return getDemoInvoiceExportRows();
  }
}

export async function getUser(email: string) {
  if (!postgresConfigured()) return undefined;
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return undefined;
  }
}
