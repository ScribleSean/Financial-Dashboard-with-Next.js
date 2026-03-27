/**
 * Stubs for static export (GitHub Pages) — mutations are not available without a server.
 */
function go(path: string) {
  if (typeof window !== 'undefined') {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    window.location.href = `${base}${path}`;
  }
}

export async function createInvoice(_formData: FormData) {
  go('/dashboard/invoices?error=demo');
}

export async function updateInvoice(_formData: FormData) {
  go('/dashboard/invoices?error=demo');
}

export async function deleteInvoice(_formData: FormData) {
  go('/dashboard/invoices?error=demo');
}
