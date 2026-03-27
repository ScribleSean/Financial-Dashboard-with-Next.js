'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const CreateInvoice = z.object({
  customerId: z
    .string({ required_error: 'Please select a customer.' })
    .min(1, 'Please select a customer.'),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    required_error: 'Please select an invoice status.',
  }),
});

const UpdateInvoice = CreateInvoice.extend({
  id: z.string(),
});

function assertPostgres() {
  if (!process.env.POSTGRES_URL) {
    redirect('/dashboard/invoices?error=demo');
  }
}

export async function createInvoice(formData: FormData) {
  assertPostgres();
  const raw = Object.fromEntries(formData.entries());
  const parsed = CreateInvoice.safeParse({
    customerId: raw.customerId,
    amount: raw.amount,
    status: raw.status,
  });
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg = Object.values(first).flat()[0];
    redirect(`/dashboard/invoices/create?error=${encodeURIComponent(msg ?? 'Invalid')}`);
  }
  const { customerId, amount, status } = parsed.data;
  const amountInCents = Math.round(amount * 100);
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (e) {
    console.error(e);
    redirect(
      `/dashboard/invoices/create?error=${encodeURIComponent('Database error')}`,
    );
  }

  revalidatePath('/dashboard/invoices');
  revalidatePath('/dashboard');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(formData: FormData) {
  assertPostgres();
  const raw = Object.fromEntries(formData.entries());
  const parsed = UpdateInvoice.safeParse({
    id: raw.id,
    customerId: raw.customerId,
    amount: raw.amount,
    status: raw.status,
  });
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg = Object.values(first).flat()[0];
    redirect(
      `/dashboard/invoices?error=${encodeURIComponent(msg ?? 'Invalid')}`,
    );
  }
  const { id, customerId, amount, status } = parsed.data;
  const amountInCents = Math.round(amount * 100);

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (e) {
    console.error(e);
    redirect(
      `/dashboard/invoices/${id}/edit?error=${encodeURIComponent('Database error')}`,
    );
  }

  revalidatePath('/dashboard/invoices');
  revalidatePath('/dashboard');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(formData: FormData) {
  assertPostgres();
  const id = z.string().min(1).safeParse(formData.get('id'));
  if (!id.success) redirect('/dashboard/invoices?error=invalid');
  try {
    await sql`DELETE FROM invoices WHERE id = ${id.data}`;
    revalidatePath('/dashboard/invoices');
    revalidatePath('/dashboard');
  } catch (e) {
    console.error(e);
  }
  redirect('/dashboard/invoices');
}
