import LoginForm from '@/app/ui/login-form';
import LoginRedirect from '@/app/ui/login-redirect';
import { lusitana } from '@/app/ui/fonts';

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 dark:bg-slate-950">
      <LoginRedirect />
      <div className="w-full max-w-[420px] space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-xl font-bold text-white shadow-lg">
            PF
          </div>
          <p className={`${lusitana.className} text-2xl font-semibold text-slate-900 dark:text-slate-100`}>
            Pinnacle Finance
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Secure access to your financial workspace
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
