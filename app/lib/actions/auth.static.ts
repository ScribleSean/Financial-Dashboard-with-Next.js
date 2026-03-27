/**
 * Client-safe auth used when STATIC_EXPORT=1 (GitHub Pages).
 * Webpack aliases this over auth.ts for static builds — no Server Actions.
 */
export async function authenticate(
  _prevState: string | undefined,
  formData: FormData,
) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  if (email === 'user@nextmail.com' && password === '123456') {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinnacle-auth', '1');
      const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
      window.location.href = `${base}/dashboard`;
    }
    return '';
  }
  return 'Invalid credentials. Try user@nextmail.com / 123456 (demo).';
}

export async function signOut() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pinnacle-auth');
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    window.location.href = `${base}/login`;
  }
}
