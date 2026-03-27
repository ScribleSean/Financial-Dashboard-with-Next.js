'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT !== 'true') return;
    const ok = localStorage.getItem('pinnacle-auth');
    if (!ok) router.replace('/login');
  }, [router]);

  return <>{children}</>;
}
