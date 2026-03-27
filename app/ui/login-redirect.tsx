'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** When on static hosting, skip login if already "signed in" via localStorage. */
export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT !== 'true') return;
    if (localStorage.getItem('pinnacle-auth')) router.replace('/dashboard');
  }, [router]);

  return null;
}
